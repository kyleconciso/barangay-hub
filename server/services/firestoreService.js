const { getFirestore } = require('firebase-admin/firestore');
const admin = require('firebase-admin'); // Import admin
const db = getFirestore();

async function getPage(slug) {
    const pageRef = db.collection('pages').doc(slug);
    const doc = await pageRef.get();
    if (!doc.exists) {
        return null;
    }
    return { id: doc.id, ...doc.data() };
}

async function createPage(pageData) {
    const { slug } = pageData;
    if (!slug) {
        throw new Error('Slug is required.');
    }

    // check if page with slug already exists
    const existingPage = await getPage(slug);
    if (existingPage) {
      throw { status: 409, message: "Slug already exists.", code: "CONFLICT" };
    }
    const pageRef = db.collection('pages').doc(slug);
    await pageRef.set({
        ...pageData,
        createdAt: new Date(),
        lastUpdated: new Date(),
    });
    return { slug, ...pageData };
}

async function updatePage(slug, pageData) {
    const pageRef = db.collection('pages').doc(slug);
    await pageRef.update({
        ...pageData,
        lastUpdated: new Date(),
    });
     return { slug, ...pageData };
}

async function deletePage(slug) {
    const pageRef = db.collection('pages').doc(slug);
    await pageRef.delete();
}

// --- News ---

async function getAllNews(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const snapshot = await db.collection('news')
        .orderBy('date', 'desc')
        .offset(offset)
        .limit(parseInt(limit))
        .get();

    const news = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
     const totalCount = (await db.collection('news').count().get()).data().count;
    return {news, totalCount};
}

async function getNewsBySlug(slug) {
    const newsRef = db.collection('news').doc(slug);
    const doc = await newsRef.get();
    if (!doc.exists) {
        return null;
    }
    return { id: doc.id, ...doc.data() };
}
async function createNews(newsData, authorId) {
    const { slug } = newsData;
    if (!slug) {
        throw new Error('Slug is required.');
    }

    // check if news slug excists
    const existingNews = await getNewsBySlug(slug);
    if (existingNews) {
      throw { status: 409, message: "Slug already exists.", code: "CONFLICT" };
    }
    const newsRef = db.collection("news").doc(slug);
    await newsRef.set({
        ...newsData,
        author: authorId,
        date: new Date(),
        createdAt: new Date(),
        lastUpdated: new Date()
    });

    return { slug, ...newsData };
}


async function updateNews(slug, newsData) {
    const newsRef = db.collection('news').doc(slug);
    await newsRef.update({
        ...newsData,
        lastUpdated: new Date(),
    });
    return {slug, ...newsData}
}

async function deleteNews(slug) {
    const newsRef = db.collection('news').doc(slug);
    await newsRef.delete();
}

// --- Requests --- 

async function getAllRequests() {
    const snapshot = await db.collection('requests').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function getRequest(id) {
  const requestRef = db.collection('requests').doc(id);
  const doc = await requestRef.get();

  if(!doc.exists) return null;

  return {id: doc.id, ...doc.data()};
}

async function createRequest(requestData) {
    const docRef = await db.collection('requests').add({
        ...requestData,
        createdAt: new Date(),
    });
    return { id: docRef.id, ...requestData };
}

async function updateRequest(id, requestData) {
    const requestRef = db.collection('requests').doc(id);
    await requestRef.update(requestData);
    return {id, ...requestData}
}

async function deleteRequest(id) {
    const requestRef = db.collection('requests').doc(id);
    await requestRef.delete();
}

// --- Tickets ---
async function getAllTickets(page = 1, limit = 10, userId = null, role = null) {
     const offset = (page - 1) * limit;
    let query = db.collection('tickets').orderBy('createdAt', 'desc');

    // apply filters via user role
    if (role === 'user' && userId) {
        query = query.where('createdBy', '==', userId);
    }
    // no filter for employee
    const snapshot = await query.offset(offset).limit(parseInt(limit)).get();
    const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const totalCount = (await db.collection('tickets').count().get()).data().count; //Warning: expensive
    return {tickets, totalCount};
}

async function getTicket(id) {
    const ticketRef = db.collection('tickets').doc(id);
    const doc = await ticketRef.get();
     if (!doc.exists) {
        return null;
    }
    return { id: doc.id, ...doc.data() };
}

async function createTicket(ticketData, userId) {
    const docRef = await db.collection('tickets').add({
        ...ticketData,
        createdBy: userId,
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: {}, // init as empty object
    });
     return { id: docRef.id, ...ticketData };
}

async function updateTicket(id, ticketData) {
    const ticketRef = db.collection('tickets').doc(id);
    await ticketRef.update({
        ...ticketData,
        updatedAt: new Date(),
    });
    return {id, ...ticketData};
}

async function deleteTicket(id) {
  const ticketRef = db.collection('tickets').doc(id);
  await ticketRef.delete();
}

async function addMessageToTicket(ticketId, messageData, userId) {
    const ticketRef = db.collection('tickets').doc(ticketId);

    await db.runTransaction(async (transaction) => {
        const ticketDoc = await transaction.get(ticketRef);
        if (!ticketDoc.exists) {
            throw new Error('Ticket not found');
        }

        const ticketData = ticketDoc.data();
        const messages = ticketData.messages || {}; // ensure messages exists

        // determine next message ID
        let nextMessageId = 1;
        if (Object.keys(messages).length > 0) {
            const messageIds = Object.keys(messages).map(Number);
            nextMessageId = Math.max(...messageIds) + 1;
        }

        // add new message
        messages[nextMessageId] = {
            userId: userId,
            content: messageData.content,
            timestamp: new Date(),
        };

        // Update the ticket
        transaction.update(ticketRef, {
            messages: messages,
            updatedAt: new Date()
        });
    });
}


// --- Users ---
async function getAllUsers(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const snapshot = await db.collection('users')
        .orderBy('createdAt', 'desc') // todo another field
        .offset(offset)
        .limit(parseInt(limit))
        .get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const totalCount = (await db.collection('users').count().get()).data().count;
    return {users, totalCount};
}

async function getUser(id) {
    const userRef = db.collection('users').doc(id);
    const doc = await userRef.get();
    if (!doc.exists) {
        return null;
    }
     return { id: doc.id, ...doc.data() };
}

async function updateUser(id, userData) {
    const userRef = db.collection('users').doc(id);
    await userRef.update(userData);
    return {id, ...userData};
}

async function deleteUser(id) {
    const userRef = db.collection('users').doc(id);
    await userRef.delete();
}

async function getAllEmployees(page = 1, limit = 10){
  const offset = (page - 1) * limit;
    const snapshot = await db.collection('users')
      .where('role', '==', 'employee')
      .orderBy('createdAt', 'desc') // todo another fields
      .offset(offset)
      .limit(parseInt(limit))
      .get();

    const employees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const totalCount = (await db.collection('users').where("role", "==", "employee").count().get()).data().count;
    return {employees, totalCount};
}

async function createEmployee(userData){
  //create to auth first.
  const { email, password, displayName, phone } = userData;
   const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName,
        phoneNumber: phone
      });

  // add user to firestore
  const db = getFirestore();
    await db.collection("users").doc(userRecord.uid).set({
        email: email,
        displayName: displayName,
        phone: phone,
        role: "employee",
        createdAt: new Date(),
        disabled: false,
      });

    return { id: userRecord.uid, email, displayName, phone, role: "employee" };
}
// --- Site Settings ---
async function getSiteSettings() {
    const settingsRef = db.collection('settings').doc('siteSettings'); // Single document
    const doc = await settingsRef.get();
      if (!doc.exists) {
        return null; // todo default settings
    }
    return doc.data();
}

async function updateSiteSettings(settingsData) {
    const settingsRef = db.collection('settings').doc('siteSettings');
    await settingsRef.set(settingsData, { merge: true }); // update by merge
    return settingsData;
}


module.exports = {
    getPage,
    createPage,
    updatePage,
    deletePage,
    getAllNews,
    getNewsBySlug,
    createNews,
    updateNews,
    deleteNews,
    getAllRequests,
    getRequest,
    createRequest,
    updateRequest,
    deleteRequest,
    getAllTickets,
    getTicket,
    createTicket,
    updateTicket,
    addMessageToTicket,
    deleteTicket,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    getSiteSettings,
    updateSiteSettings,
    getAllEmployees,
    createEmployee
};