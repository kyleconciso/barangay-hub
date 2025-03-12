const { Firestore } = require("@google-cloud/firestore");
const { db } = require("../config/firebase");
const admin = require("firebase-admin");
const populateData = require("./data.json");

async function deleteCollection(collectionPath) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy("__name__").limit(500);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();

  if (snapshot.size === 0) {
    resolve();
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}

function getRandomWidthHeight(baseWidth, baseHeight, variation) {
  const width =
    baseWidth + Math.floor(Math.random() * 2 * variation) - variation;
  const height =
    baseHeight + Math.floor(Math.random() * 2 * variation) - variation;
  return { width, height };
}

async function populatePages() {
  const pagesRef = db.collection("pages");
  const pagesData = populateData.pages;

  for (const pageData of pagesData) {
    await pagesRef.doc(pageData.id).set({
      ...pageData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      imageURL: pageData.imageURL,
    });
    console.log(`Page created: ${pageData.id}`);
  }
}

async function populateForms() {
  const formsRef = db.collection("forms");
  const formsData = populateData.forms;
  for (const formData of formsData) {
    const docRef = formsRef.doc();
    await docRef.set({
      id: docRef.id,
      ...formData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      imageURL: formData.imageURL,
    });
    console.log(`Form created: ${docRef.id}`);
  }
}

async function populateTickets() {
  const ticketsRef = db.collection("tickets");
  const ticketsData = populateData.tickets;

  for (const ticketData of ticketsData) {
    const docRef = ticketsRef.doc();
    await docRef.set({
      id: docRef.id,
      ...ticketData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`Ticket created: ${docRef.id}`);
  }
}

async function populateMessages() {
  const messagesRef = db.collection("messages");

  const tickets = await db.collection("tickets").limit(5).get();
  if (tickets.empty) {
    console.warn("No tickets found.  Skipping messages population.");
    return;
  }

  const messagesDataPopulated = [];
  tickets.forEach((doc) => {
    const ticketId = doc.id;
    messagesDataPopulated.push(
      {
        ticket: ticketId,
        content: "Initial message regarding the issue.",
        createdBy: "defaultUserId",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        ticket: ticketId,
        content: "Update on the issue resolution.",
        createdBy: "defaultEmployeeId",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        ticket: ticketId,
        content: "Further details provided.",
        createdBy: "defaultUserId",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        ticket: ticketId,
        content: "Question regarding the issue.",
        createdBy: "defaultUserId",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        ticket: ticketId,
        content: "Issue resolved confirmation.",
        createdBy: "defaultEmployeeId",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }
    );
  });

  for (const messageDataItem of messagesDataPopulated) {
    const docRef = messagesRef.doc();
    await docRef.set({
      id: docRef.id,
      ...messageDataItem,
    });
    console.log(`Message created: ${docRef.id}`);
  }
}

async function populateSettings() {
  const settingsRef = db.collection("settings");
  const settingsData = populateData.settings;
  const docRef = settingsRef.doc("appSettings");

  await docRef.set(settingsData);
  console.log(`Setting created: ${docRef.id}`);
}

async function populateArticles() {
  const articlesRef = db.collection("articles");
  const articlesData = populateData.articles;

  for (const articleData of articlesData) {
    const docRef = articlesRef.doc();
    await docRef.set({
      id: docRef.id,
      ...articleData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`Article created: ${docRef.id}`);
  }
}

async function populateUsers() {
  const usersRef = db.collection("users");
  const usersData = populateData.users;

  for (const userData of usersData) {
    try {
      let userRecord;
      try {
        userRecord = await admin.auth().createUser({
          email: userData.email,
          password: "123456",
          displayName: `${userData.firstName} ${userData.lastName}`,
        });
        console.log(
          `Firebase Auth user created: ${userRecord.uid} (${userData.email})`
        );
      } catch (authError) {
        if (authError.code === "auth/email-already-exists") {
          console.warn(
            `Auth user with email ${userData.email} already exists.  Fetching UID...`
          );
          userRecord = await admin.auth().getUserByEmail(userData.email);
          console.log(`Found existing user with UID: ${userRecord.uid}`);
        } else {
          console.error("Error creating user in Firebase Auth:", authError);
          continue;
        }
      }

      const firestoreUserData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone || null,
        address: userData.address || null,
        type: userData.type,
        role: userData.role,
        bio: userData.bio,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      const existingUserQuery = await usersRef
        .where("email", "==", userData.email)
        .get();
      if (existingUserQuery.empty) {
        await usersRef.add(firestoreUserData);
        console.log(`Firestore document created for: ${userData.email}`);
      } else {
        console.warn(
          `Firestore document for ${userData.email} already exists. Skipping creation.`
        );
      }
    } catch (error) {
      console.error("Error processing user:", error); // General error handling
    }
  }
}

async function deleteAllCollections() {
  console.log("Deleting existing data...");
  await deleteCollection("pages");
  await deleteCollection("articles");
  await deleteCollection("forms");
  await deleteCollection("tickets");
  await deleteCollection("messages");
  await deleteCollection("users");
  console.log("Existing data deleted.");
}

async function populateAll() {
  try {
    await deleteAllCollections();
    await populatePages();
    await populateForms();
    await populateTickets();
    await populateMessages();
    await populateSettings();
    await populateArticles();
    await populateUsers();
    console.log("Collections populated.");
  } catch (error) {
    console.error("Error:", error);
  }
}

populateAll();
