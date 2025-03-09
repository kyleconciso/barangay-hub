// !!!DANGEROUS!!!, resets all data, for adding placeholder content testing only 

const { Firestore } = require('@google-cloud/firestore');
const { db } = require('./config/firebase')

async function deleteCollection(collectionPath) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(500);

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
    const width = baseWidth + Math.floor(Math.random() * 2 * variation) - variation;
    const height = baseHeight + Math.floor(Math.random() * 2 * variation) - variation;
    return { width, height };
}

async function populatePages() {
    const pagesRef = db.collection('pages');

    const pagesData = [
        {
            id: 'officials',
            slug: 'officials',
            title: 'Barangay Officials',
            content: `<p><strong>Barangay Captain:</strong> Juan Dela Cruz</p><p>Captain Juan Dela Cruz has been a dedicated public servant for over 15 years, starting as a Barangay Kagawad before being elected as Captain. His vision for the barangay is one of progress, inclusivity, and sustainability. He is committed to improving infrastructure, promoting livelihood programs, and ensuring the safety and well-being of all residents. His accomplishments include the construction of a new multi-purpose hall, the implementation of a comprehensive waste management system, and the establishment of a scholarship program for deserving students. Captain Dela Cruz believes in transparent governance and actively encourages citizen participation in barangay affairs. He holds regular consultations with residents to address their concerns and gather feedback on proposed projects. His office is always open to the public, and he is known for his approachable and compassionate leadership style.</p><p><strong>Kagawad (Councilor):</strong> Maria Santos</p><p>Kagawad Maria Santos is a strong advocate for education, health, and women's empowerment. Before entering politics, she worked as a teacher and community organizer, gaining valuable experience in addressing the needs of marginalized sectors. As Kagawad, she chairs the Committee on Education and has initiated several programs to improve the quality of education in the barangay, including providing free tutorials for students and organizing workshops for teachers. She is also actively involved in promoting health awareness and has partnered with local health centers to conduct regular medical missions and vaccination drives. Kagawad Santos is a tireless worker and a champion for the rights of women and children.</p><p><strong>Sangguniang Kabataan (SK) Chairperson:</strong> Pedro Reyes</p><p>SK Chairperson Pedro Reyes represents the youth of the barangay. He is a dynamic and energetic leader who is passionate about empowering young people and providing them with opportunities for growth and development. He has organized various youth-oriented activities, such as sports tournaments, leadership training seminars, and environmental awareness campaigns. He believes in the power of the youth to bring about positive change and actively encourages their participation in barangay governance. He is also a strong advocate for education and has initiated programs to provide scholarships and educational assistance to underprivileged youth. He works closely with the Barangay Council to ensure that the needs and concerns of the youth are addressed.</p><p><strong>SK Kagawad:</strong> Anna Lim</p><p>SK Kagawad Anna Lim assists the SK Chairperson. She focuses on environmental projects and youth engagement in community cleanups. Anna is also passionate about promoting mental health awareness among young people and organizes workshops and support groups. She works tirelessly to connect with the youth and address their specific needs, making sure that their voices are heard in barangay discussions.</p><p>Contact the officials through the Barangay Hall at (123) 456-7890.</p><ul><li>Captain's Office Hours: Monday - Friday, 9:00 AM - 12:00 PM</li><li>Kagawad's Office Hours: Tuesday & Thursday, 1:00 PM - 4:00 PM</li><li>SK Chairperson's Office Hours: Monday & Wednesday, 2:00 PM - 5:00 PM</li><li>SK Kagawad's Office Hours: By Appointment</li></ul>`,
            createdBy: 'initial_setup',
            updatedBy: 'initial_setup',
            bannerURL: (() => {
              const { width, height } = getRandomWidthHeight(800, 400, 10);
              return `https://picsum.photos/${width}/${height}`;
            })()
        },
        {
            id: 'contact',
            slug: 'contact',
            title: 'Contact Information',
            content: `<p><strong>Barangay Hall Address:</strong> 123 Main Street, Barangay XYZ, City/Town, Province, Philippines, 12345</p><p>Our Barangay Hall is centrally located and easily accessible. We are open to the public during regular business hours and welcome all residents to visit us for any concerns or inquiries. The Barangay Hall is a hub for community activities and a place where residents can connect with their local government.</p><p><strong>Phone Number:</strong> (123) 456-7890</p><p>You can reach us by phone during office hours. Our friendly staff will be happy to assist you with your inquiries or direct you to the appropriate department. For urgent matters outside of office hours, please use the 24/7 hotline.</p><p><strong>Email Address:</strong> info@barangayxyz.example.com</p><p>Send us an email for any non-urgent inquiries or requests. We strive to respond to all emails within 24-48 hours. Please provide as much detail as possible in your email to help us assist you effectively.</p><p><strong>Office Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM (Closed on Public Holidays)</p><p>Please note our regular office hours. We are closed on weekends and public holidays. Appointments are encouraged for specific concerns or meetings with officials.</p><p><strong>24/7 Hotline:</strong> (987) 654-3210</p><p>For emergencies or urgent matters outside of office hours, please call our 24/7 hotline. This hotline is for reporting incidents, requesting immediate assistance, or addressing critical concerns that cannot wait until regular office hours.</p><p>You can also reach us through our official social media channels:</p><ul><li>Facebook: <a href="https://www.facebook.com/barangayxyz">facebook.com/barangayxyz</a></li><li>Twitter: <a href="https://twitter.com/barangayxyz">@barangayxyz</a></li></ul><p>Follow us on social media for the latest updates, announcements, and community events. We also use these platforms to engage with residents and answer questions.</p><p>For specific concerns, please contact the relevant department or official directly. Contact information for individual officials can be found on the "Officials" page.</p><p>We are committed to serving our community and providing accessible and responsive services to all residents. Your feedback is important to us, so please do not hesitate to reach out with any questions, suggestions, or concerns.</p>`,
            createdBy: 'initial_setup',
            updatedBy: 'initial_setup',
            bannerURL: (() => {
              const { width, height } = getRandomWidthHeight(800, 400, 10);
              return `https://picsum.photos/${width}/${height}`;
            })()
        }
    ];

    for (const pageData of pagesData) {
        await pagesRef.doc(pageData.id).set({
            ...pageData,
            createdAt: Firestore.FieldValue.serverTimestamp(),
            updatedAt: Firestore.FieldValue.serverTimestamp(),
        });
        console.log(`Page created: ${pageData.id}`);
    }
}

async function populateForms() {
    const formsRef = db.collection('forms');
    const formsData = [
        {
            title: 'Clearance Application',
            description: 'Apply for a barangay clearance.',
            link: 'https://example.com/clearance',
            logoURL: 'https://picsum.photos/150/150',
            createdBy: 'initial_setup',
            updatedBy: 'initial_setup',
        },
        {
            title: 'Permit Application',
            description: 'Apply for a business permit.',
            link: 'https://example.com/permit',
            logoURL: 'https://picsum.photos/150/150',
            createdBy: 'initial_setup',
            updatedBy: 'initial_setup',
        },
        {
            title: 'Event Registration',
            description: 'Register for community events.',
            link: 'https://example.com/event',
            logoURL: 'https://picsum.photos/150/150',
            createdBy: 'initial_setup',
            updatedBy: 'initial_setup',
        },
        {
            title: 'Feedback Form',
            description: 'Provide feedback to the barangay.',
            link: 'https://example.com/feedback',
            logoURL: 'https://picsum.photos/150/150',
            createdBy: 'initial_setup',
            updatedBy: 'initial_setup',
        },
        {
            title: 'Residency Verification',
            description: 'Verify your residency status.',
            link: 'https://example.com/residency',
            logoURL: 'https://picsum.photos/150/150',
            createdBy: 'initial_setup',
            updatedBy: 'initial_setup',
        }
    ];

    for (const formData of formsData) {
        const docRef = formsRef.doc();
        await docRef.set({
            id: docRef.id,
            ...formData,
            createdAt: Firestore.FieldValue.serverTimestamp(),
            updatedAt: Firestore.FieldValue.serverTimestamp(),
        });
        console.log(`Form created: ${docRef.id}`);
    }
}

async function populateTickets() {
    const ticketsRef = db.collection('tickets');
    const ticketsData = [
        {
            title: 'Streetlight Repair',
            status: 'OPEN',
            assignedTo: 'defaultEmployeeId',
            createdBy: 'defaultUserId',
            updatedBy: 'defaultUserId',
        },
        {
            title: 'Document Request',
            status: 'IN_PROGRESS',
            assignedTo: 'defaultEmployeeId',
            createdBy: 'defaultUserId',
            updatedBy: 'defaultEmployeeId',
        },
        {
            title: 'Noise Complaint',
            status: 'CLOSED',
            assignedTo: 'defaultEmployeeId',
            createdBy: 'defaultUserId',
            updatedBy: 'defaultEmployeeId',
        },
        {
            title: 'Water Outage',
            status: 'OPEN',
            assignedTo: 'defaultEmployeeId',
            createdBy: 'defaultUserId',
            updatedBy: 'defaultUserId',
        },
        {
            title: 'Garbage Collection Issue',
            status: 'IN_PROGRESS',
            assignedTo: 'defaultEmployeeId',
            createdBy: 'defaultUserId',
            updatedBy: 'defaultEmployeeId',
        },
    ];

    for (const ticketData of ticketsData) {
        const docRef = ticketsRef.doc();
        await docRef.set({
            id: docRef.id,
            ...ticketData,
            createdAt: Firestore.FieldValue.serverTimestamp(),
            updatedAt: Firestore.FieldValue.serverTimestamp(),
        });
        console.log(`Ticket created: ${docRef.id}`);
    }
}

async function populateMessages() {
    const messagesRef = db.collection('messages');
    const tickets = await db.collection('tickets').limit(5).get();
    if (tickets.empty) {
        console.warn('No tickets. Skipping messages.');
        return;
    }

    const messagesData = [];

    tickets.forEach((doc) => {
        const ticketId = doc.id;
        messagesData.push(
            {
                ticket: ticketId,
                content: 'Initial message regarding the issue.',
                createdBy: 'defaultUserId',
                createdAt: Firestore.FieldValue.serverTimestamp(),
            },
            {
                ticket: ticketId,
                content: 'Update on the issue resolution.',
                createdBy: 'defaultEmployeeId',
                createdAt: Firestore.FieldValue.serverTimestamp(),
            },
            {
                ticket: ticketId,
                content: 'Further details provided.',
                createdBy: 'defaultUserId',
                createdAt: Firestore.FieldValue.serverTimestamp(),
            },
            {
                ticket: ticketId,
                content: 'Question regarding the issue.',
                createdBy: 'defaultUserId',
                createdAt: Firestore.FieldValue.serverTimestamp(),
            },
            {
                ticket: ticketId,
                content: 'Issue resolved confirmation.',
                createdBy: 'defaultEmployeeId',
                createdAt: Firestore.FieldValue.serverTimestamp(),
            }
        );
    });

    for (const messageData of messagesData) {
        const docRef = messagesRef.doc();
        await docRef.set({
            id: docRef.id,
            ...messageData,
        });
        console.log(`Message created: ${docRef.id}`);
    }
}

async function populateSettings() {
    const settingsRef = db.collection('settings');
    const docRef = settingsRef.doc('appSettings');

    await docRef.set({
        facebookPageId: 'barangayxyz',
        googleGeminiKey: 'YOUR_GEMINI_API_KEY',
        facebookAccessToken: 'YOUR_FACEBOOK_ACCESS_TOKEN'
    });
    console.log(`Setting created: ${docRef.id}`);
}

async function populateArticles() {
    const articlesRef = db.collection('articles');
    const articlesData = [
        {
            title: 'New Barangay Hall Construction Completed',
            slug: 'new-barangay-hall-construction-completed',
            content: `<p><strong>Barangay XYZ, [City/Town] –</strong> The new Barangay Hall has been officially completed and inaugurated. This marks a significant milestone in our community's development, providing a modern and accessible space for residents to access services and participate in barangay activities. The construction project, which began [Start Date], was completed on [End Date] and was funded through [Funding Source]. <img src="${(() => {const { width, height } = getRandomWidthHeight(300, 200, 10); return `https://picsum.photos/${width}/${height}`;})()}" alt="Barangay Hall" /></p><p>The new hall features [List key features, e.g., a larger multi-purpose hall, dedicated offices for officials, improved accessibility for persons with disabilities]. This will allow us to better serve the needs of our growing population and provide a more efficient and comfortable environment for both residents and barangay staff.</p><p>Barangay Captain [Captain's Name] expressed [his/her] gratitude to all those who contributed to the project, including [Mention key individuals or organizations]. [He/She] emphasized the importance of the new hall as a symbol of progress and a center for community building.</p><p>Residents are invited to visit the new Barangay Hall during regular office hours. A formal inauguration ceremony will be held on [Date] at [Time], and all members of the community are welcome to attend.</p><p>We look forward to serving you better in our new facility!</p>`,
            createdBy: 'initial_setup',
            lastUpdatedBy: 'initial_setup',
            bannerURL: (() => {
              const { width, height } = getRandomWidthHeight(800, 400, 10);
              return `https://picsum.photos/${width}/${height}`;
            })()
        },
        {
            title: 'Successful Community Cleanup Drive Held',
            slug: 'successful-community-cleanup-drive-held',
            content: `<p><strong>Barangay XYZ, [City/Town] –</strong> A successful community cleanup drive was held on [Date], with the participation of over [Number] residents. Volunteers gathered at [Meeting Point] and worked together to clean up [Areas cleaned]. The event was organized by [Organizing body, e.g., the Sangguniang Kabataan, a local environmental group] in partnership with the Barangay Council. <img src="${(() => {const { width, height } = getRandomWidthHeight(300, 200, 10); return `https://picsum.photos/${width}/${height}`;})()}" alt="Cleanup Drive" /></p><p>The cleanup drive aimed to [State the objectives, e.g., promote environmental awareness, reduce litter, improve the cleanliness of the barangay]. Participants collected [Amount] of trash, including [Types of trash collected]. The collected waste was properly segregated and disposed of in accordance with local regulations.</p><p>[Quote from an organizer or participant about the importance of the event].</p><p>The organizers thanked all the volunteers for their participation and dedication. They also expressed their appreciation to [Mention any sponsors or supporters]. Plans are underway for future cleanup drives and other environmental initiatives.</p><p>This event highlights the strong spirit of community cooperation in Barangay XYZ and our commitment to maintaining a clean and healthy environment.</p>`,
            createdBy: 'initial_setup',
            lastUpdatedBy: 'initial_setup',
             bannerURL: (() => {
              const { width, height } = getRandomWidthHeight(800, 400, 10);
              return `https://picsum.photos/${width}/${height}`;
            })()
        },
        {
            title: 'Free Medical Mission Benefits Hundreds of Residents',
            slug: 'free-medical-mission-benefits-hundreds-of-residents',
            content: `<p><strong>Barangay XYZ, [City/Town] –</strong> A free medical mission was conducted on [Date] at [Location], providing essential healthcare services to over [Number] residents. The mission was organized by [Organizing body] in collaboration with [Partner organizations, e.g., local hospitals, medical professionals]. <img src="${(() => {const { width, height } = getRandomWidthHeight(300, 200, 10); return `https://picsum.photos/${width}/${height}`;})()}" alt="Medical Mission" /></p><p>Services offered included [List services, e.g., general checkups, dental extractions, eye exams, distribution of free medicines]. A team of [Number] doctors, nurses, and other healthcare volunteers provided their expertise and time to serve the community.</p><p>The medical mission aimed to address the healthcare needs of residents, particularly those who have limited access to regular medical care. Many beneficiaries expressed their gratitude for the free services, which helped them address health concerns and receive necessary medications.</p><p>[Quote from an organizer or beneficiary about the impact of the mission].</p><p>The organizers thanked all the volunteers and partners for their support in making the medical mission a success. They also expressed their commitment to continuing to provide healthcare services to the community.</p>`,
             createdBy: 'initial_setup',
            lastUpdatedBy: 'initial_setup',
             bannerURL: (() => {
              const { width, height } = getRandomWidthHeight(800, 400, 10);
              return `https://picsum.photos/${width}/${height}`;
            })()
        },
        {
            title: 'Livelihood Training Program Empowers Residents',
            slug: 'livelihood-training-program-empowers-residents',
            content: `<p><strong>Barangay XYZ, [City/Town] –</strong> A livelihood training program was recently concluded, equipping [Number] residents with new skills to enhance their income-generating opportunities. The program, which ran from [Start Date] to [End Date], was organized by [Organizing body] in partnership with [Partner organizations, e.g., government agencies, NGOs]. <img src="${(() => {const { width, height } = getRandomWidthHeight(300, 200, 10); return `https://picsum.photos/${width}/${height}`;})()}" alt="Livelihood Training" /></p><p>Participants received training in [List skills taught, e.g., basic dressmaking, food processing, handicrafts, computer literacy]. The program included both theoretical and practical sessions, providing hands-on experience and guidance from experienced trainers.</p><p>The livelihood training program aims to empower residents, particularly those from low-income families, by providing them with the skills and knowledge to start their own small businesses or find employment. Graduates of the program are expected to use their new skills to improve their economic well-being and contribute to the overall development of the barangay.</p><p>[Quote from an organizer or participant about the benefits of the program].</p><p>The organizers are planning to conduct follow-up sessions and provide ongoing support to the graduates to help them establish their businesses or find employment. They also plan to expand the program to offer more training opportunities in the future.</p>`,
            createdBy: 'initial_setup',
            lastUpdatedBy: 'initial_setup',
             bannerURL: (() => {
              const { width, height } = getRandomWidthHeight(800, 400, 10);
              return `https://picsum.photos/${width}/${height}`;
            })()
        },
        {
            title: 'Barangay XYZ Celebrates Annual Fiesta',
            slug: 'barangay-xyz-celebrates-annual-fiesta',
            content: `<p><strong>Barangay XYZ, [City/Town] –</strong> Barangay XYZ recently celebrated its annual fiesta, a vibrant and festive occasion that brought the community together in a spirit of unity and thanksgiving. The fiesta, held from [Start Date] to [End Date], featured a variety of activities and events that showcased the rich culture and traditions of the barangay. <img src="${(() => {const { width, height } = getRandomWidthHeight(300, 200, 10); return `https://picsum.photos/${width}/${height}`;})()}" alt="Barangay Fiesta" /></p><p>Highlights of the fiesta included [List key events, e.g., a parade, street dancing competition, cultural performances, religious procession, nightly entertainment]. Residents and visitors alike enjoyed the colorful displays, delicious food, and lively atmosphere.</p><p>The fiesta is an important annual event that honors [Patron saint or reason for the fiesta]. It provides an opportunity for residents to reconnect with their roots, strengthen community bonds, and celebrate their shared heritage.</p><p>[Quote from an official or resident about the significance of the fiesta].</p><p>The Barangay Council expressed its gratitude to all those who contributed to the success of the fiesta, including the organizers, sponsors, performers, and volunteers. They also thanked all the residents and visitors for their participation and support.</p><p>The annual fiesta is a testament to the vibrant community spirit of Barangay XYZ and its commitment to preserving its cultural heritage.</p>`,
            createdBy: 'initial_setup',
            lastUpdatedBy: 'initial_setup',
             bannerURL: (() => {
              const { width, height } = getRandomWidthHeight(800, 400, 10);
              return `https://picsum.photos/${width}/${height}`;
            })()
        }
    ];

    for (const articleData of articlesData) {
        const docRef = articlesRef.doc();
        await docRef.set({
            id: docRef.id,
            ...articleData,
            createdAt: Firestore.FieldValue.serverTimestamp(),
            lastUpdated: Firestore.FieldValue.serverTimestamp()
        });
        console.log(`Article created: ${docRef.id}`);
    }
}

async function deleteAllCollections() {
    console.log('Deleting existing data...');
    await deleteCollection('pages');
    await deleteCollection('articles');
    await deleteCollection('forms');
    await deleteCollection('tickets');
    await deleteCollection('messages');
    console.log('Existing data deleted.');
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
        console.log('Collections populated.');
    } catch (error) {
        console.error('Error:', error);
    }
}

populateAll();