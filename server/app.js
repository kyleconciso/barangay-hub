const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json');
const { body, validationResult } = require('express-validator');
const path = require('path');

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Authentication Middleware
const authenticate = async (req, res, next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const token = req.headers.authorization.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;

        const userDoc = await db.collection('users').doc(decodedToken.uid).get();
        if (userDoc.exists) {
            req.userData = userDoc.data();
        }

        return next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};

// Authorization Middleware (Roles)
const isAdmin = (req, res, next) => {
    if (req.userData && req.userData.type === 'ADMIN') {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Access denied' });
};

const isEmployeeOrAdmin = (req, res, next) => {
    if (req.userData && (req.userData.type === 'EMPLOYEE' || req.userData.type === 'ADMIN')) {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Access denied' });
};

const handleApiError = (res, error, defaultMessage = 'Internal server error') => {
    console.error(error); // Log the error for debugging
    const statusCode = error.status || 500;  
    const message = error.message || defaultMessage;

    return res.status(statusCode).json({
        success: false,
        message: message,
        error: {
            code: error.code, 
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined //only include stack trace in development
        }
    });
};



// Authentication Routes
app.post('/api/v1/auth/register', [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Invalid registration data', errors: errors.array() });
    }

    try {
        const userRecord = await admin.auth().createUser({
            email: req.body.email,
            password: req.body.password || Math.random().toString(36).substring(2, 15),
            displayName: `${req.body.firstName} ${req.body.lastName}`
        });

        const userData = {
            id: userRecord.uid,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone || null,
            address: req.body.address || null,
            type: req.body.type || 'RESIDENT',
            imageURL: req.body.imageURL || null, // Add imageURL
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('users').doc(userRecord.uid).set(userData);

        return res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        // Use the centralized error handler
        return handleApiError(res, error, 'Registration failed');
    }
});

app.get('/api/v1/auth/me', authenticate, async (req, res) => {
    try {
        const userDoc = await db.collection('users').doc(req.user.uid).get();

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json(userDoc.data());
    } catch (error) {
        return handleApiError(res, error, 'Failed to get user information');
    }
});

// Pages Routes
app.get('/api/v1/pages', async (req, res) => {
    try {
        const pagesSnapshot = await db.collection('pages').get();
        const pages = [];

        pagesSnapshot.forEach(doc => {
            pages.push({ id: doc.id, ...doc.data() });
        });

        return res.status(200).json(pages);
    } catch (error) {
        return handleApiError(res, error, 'Failed to get pages');
    }
});

app.post('/api/v1/pages', authenticate, isEmployeeOrAdmin, async (req, res) => {
    try {
        const pageData = {
            slug: req.body.slug,
            title: req.body.title,
            content: req.body.content || '',
            imageURL: req.body.imageURL || null, // Add imageURL
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            createdBy: req.user.uid,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedBy: req.user.uid
        };

        const pageRef = await db.collection('pages').add(pageData);
        const newPage = { id: pageRef.id, ...pageData };

        return res.status(201).json(newPage);
    } catch (error) {
        return handleApiError(res, error, 'Failed to create page');
    }
});

app.get('/api/v1/pages/:id', async (req, res) => {
    try {
        const pageDoc = await db.collection('pages').doc(req.params.id).get();

        if (!pageDoc.exists) {
            return res.status(404).json({ success: false, message: 'Page not found' });
        }

        return res.status(200).json({ id: pageDoc.id, ...pageDoc.data() });
    } catch (error) {
         return handleApiError(res, error, 'Failed to get page');
    }
});

app.put('/api/v1/pages/:id', authenticate, isEmployeeOrAdmin, async (req, res) => {
    try {
        const pageRef = db.collection('pages').doc(req.params.id);
        const pageDoc = await pageRef.get();

        if (!pageDoc.exists) {
            return res.status(404).json({ success: false, message: 'Page not found' });
        }

        const pageData = {
            slug: req.body.slug,
            title: req.body.title,
            content: req.body.content || '',
            imageURL: req.body.imageURL || null,  // Add imageURL
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedBy: req.user.uid
        };

        await pageRef.update(pageData);

        return res.status(200).json({ id: pageRef.id, ...pageData, createdAt: pageDoc.data().createdAt, createdBy: pageDoc.data().createdBy });
    } catch (error) {
       return handleApiError(res, error, 'Failed to update page');
    }
});

app.delete('/api/v1/pages/:id', authenticate, isEmployeeOrAdmin, async (req, res) => {
    try {
        const pageRef = db.collection('pages').doc(req.params.id);
        const pageDoc = await pageRef.get();

        if (!pageDoc.exists) {
            return res.status(404).json({ success: false, message: 'Page not found' });
        }

        await pageRef.delete();

        return res.status(204).send();
    } catch (error) {
        return handleApiError(res, error, 'Failed to delete page');
    }
});

// Articles Routes
app.get('/api/v1/articles', async (req, res) => {
  try {
    const articlesSnapshot = await db.collection('articles').get();
    const articles = [];

    articlesSnapshot.forEach(doc => {
      articles.push({ id: doc.id, ...doc.data() });
    });

    return res.status(200).json(articles);
  } catch (error) {
    return handleApiError(res, error, 'Failed to get articles');
  }
});

app.post('/api/v1/articles', authenticate, isEmployeeOrAdmin, async (req, res) => {
  try {
    const articleData = {
      title: req.body.title,
      slug: req.body.slug,
      content: req.body.content || '',
      imageURL: req.body.imageURL || null, // Add imageURL
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: req.user.uid,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      lastUpdatedBy: req.user.uid
    };

    const articleRef = await db.collection('articles').add(articleData);
    const newArticle = { id: articleRef.id, ...articleData };

    return res.status(201).json(newArticle);
  } catch (error) {
    return handleApiError(res, error, 'Failed to create article');
  }
});

app.get('/api/v1/articles/:id', async (req, res) => {
  try {
    const articleDoc = await db.collection('articles').doc(req.params.id).get();

    if (!articleDoc.exists) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    return res.status(200).json({ id: articleDoc.id, ...articleDoc.data() });
  } catch (error) {
    return handleApiError(res, error, 'Failed to get article');
  }
});

app.put('/api/v1/articles/:id', authenticate, isEmployeeOrAdmin, async (req, res) => {
  try {
    const articleRef = db.collection('articles').doc(req.params.id);
    const articleDoc = await articleRef.get();

    if (!articleDoc.exists) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    const articleData = {
      title: req.body.title,
      slug: req.body.slug,
      content: req.body.content || '',
      imageURL: req.body.imageURL || null, // Add imageURL
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      lastUpdatedBy: req.user.uid
    };

    await articleRef.update(articleData);

    return res.status(200).json({
      id: articleRef.id,
      ...articleData,
      createdAt: articleDoc.data().createdAt,
      createdBy: articleDoc.data().createdBy
    });
  } catch (error) {
    return handleApiError(res, error, 'Failed to update article');
  }
});

app.delete('/api/v1/articles/:id', authenticate, isEmployeeOrAdmin, async (req, res) => {
  try {
    const articleRef = db.collection('articles').doc(req.params.id);
    const articleDoc = await articleRef.get();

    if (!articleDoc.exists) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    await articleRef.delete();

    return res.status(204).send();
  } catch (error) {
    return handleApiError(res, error, 'Failed to delete article');
  }
});

// Forms Routes
app.get('/api/v1/forms', async (req, res) => {
    try {
        const formsSnapshot = await db.collection('forms').get();
        const forms = [];

        formsSnapshot.forEach(doc => {
            forms.push({ id: doc.id, ...doc.data() });
        });

        return res.status(200).json(forms);
    } catch (error) {
        return handleApiError(res, error, 'Failed to get forms');
    }
});

app.post('/api/v1/forms', authenticate, isEmployeeOrAdmin, async (req, res) => {
    try {
        const formData = {
            title: req.body.title,
            description: req.body.description || '',
            link: req.body.link,
            imageURL: req.body.imageURL || null, // Updated field name
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            createdBy: req.user.uid,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedBy: req.user.uid
        };

        const formRef = await db.collection('forms').add(formData);
        const newForm = { id: formRef.id, ...formData };

        return res.status(201).json(newForm);
    } catch (error) {
        return handleApiError(res, error, 'Failed to create form');
    }
});

app.get('/api/v1/forms/:id', async (req, res) => {
    try {
        const formDoc = await db.collection('forms').doc(req.params.id).get();

        if (!formDoc.exists) {
            return res.status(404).json({ success: false, message: 'Form not found' });
        }

        return res.status(200).json({ id: formDoc.id, ...formDoc.data() });
    } catch (error) {
        return handleApiError(res, error, 'Failed to get form');
    }
});

app.put('/api/v1/forms/:id', authenticate, isEmployeeOrAdmin, async (req, res) => {
    try {
        const formRef = db.collection('forms').doc(req.params.id);
        const formDoc = await formRef.get();

        if (!formDoc.exists) {
            return res.status(404).json({ success: false, message: 'Form not found' });
        }

        const formData = {
            title: req.body.title,
            description: req.body.description || '',
            link: req.body.link,
            imageURL: req.body.imageURL || null, // Updated field name
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedBy: req.user.uid
        };

        await formRef.update(formData);

        return res.status(200).json({
            id: formRef.id,
            ...formData,
            createdAt: formDoc.data().createdAt,
            createdBy: formDoc.data().createdBy
        });
    } catch (error) {
        return handleApiError(res, error, 'Failed to update form');
    }
});

app.delete('/api/v1/forms/:id', authenticate, isEmployeeOrAdmin, async (req, res) => {
    try {
        const formRef = db.collection('forms').doc(req.params.id);
        const formDoc = await formRef.get();

        if (!formDoc.exists) {
            return res.status(404).json({ success: false, message: 'Form not found' });
        }

        await formRef.delete();

        return res.status(204).send();
    } catch (error) {
        return handleApiError(res, error, 'Failed to delete form');
    }
});

// Tickets Routes
app.get('/api/v1/tickets', authenticate, async (req, res) => {
  try {
    let ticketsQuery = db.collection('tickets');

    if (req.userData.type === 'RESIDENT') {
      ticketsQuery = ticketsQuery.where('createdBy', '==', req.user.uid);
    }

    const ticketsSnapshot = await ticketsQuery.get();
    const tickets = [];

    ticketsSnapshot.forEach(doc => {
      tickets.push({ id: doc.id, ...doc.data() });
    });

    return res.status(200).json(tickets);
  } catch (error) {
    return handleApiError(res, error, 'Failed to get tickets');
  }
});

app.post('/api/v1/tickets', authenticate, async (req, res) => {
  try {
    // regular users can only create tickets for themselves
    if (req.userData.type === 'RESIDENT' && req.body.createdBy && req.body.createdBy !== req.user.uid) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const ticketData = {
      title: req.body.title,
      status: req.body.status || 'OPEN',
      assignedTo: req.body.assignedTo || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: req.user.uid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: req.user.uid
    };

    const ticketRef = await db.collection('tickets').add(ticketData);
    const newTicket = { id: ticketRef.id, ...ticketData };

    return res.status(201).json(newTicket);
  } catch (error) {
    return handleApiError(res, error, 'Failed to create ticket');
  }
});

app.get('/api/v1/tickets/:id', authenticate, async (req, res) => {
  try {
    const ticketDoc = await db.collection('tickets').doc(req.params.id).get();

    if (!ticketDoc.exists) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const ticketData = ticketDoc.data();

    if (req.userData.type === 'RESIDENT' && ticketData.createdBy !== req.user.uid) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    return res.status(200).json({ id: ticketDoc.id, ...ticketData });
  } catch (error) {
    return handleApiError(res, error, 'Failed to get ticket');
  }
});

app.put('/api/v1/tickets/:id', authenticate, async (req, res) => {
  try {
    const ticketRef = db.collection('tickets').doc(req.params.id);
    const ticketDoc = await ticketRef.get();

    if (!ticketDoc.exists) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const ticketData = ticketDoc.data();

    if (req.userData.type === 'RESIDENT' && ticketData.createdBy !== req.user.uid) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const updatedTicketData = {
      title: req.body.title,
      status: req.body.status,
      assignedTo: req.body.assignedTo,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: req.user.uid
    };

    await ticketRef.update(updatedTicketData);

    return res.status(200).json({
      id: ticketRef.id,
      ...updatedTicketData,
      createdAt: ticketData.createdAt,
      createdBy: ticketData.createdBy
    });
  } catch (error) {
    return handleApiError(res, error, 'Failed to update ticket');
  }
});

app.delete('/api/v1/tickets/:id', authenticate, async (req, res) => {
  try {
    const ticketRef = db.collection('tickets').doc(req.params.id);
    const ticketDoc = await ticketRef.get();

    if (!ticketDoc.exists) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const ticketData = ticketDoc.data();

    if (req.userData.type === 'RESIDENT' && ticketData.createdBy !== req.user.uid) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await ticketRef.delete();

    return res.status(204).send();
  } catch (error) {
    return handleApiError(res, error, 'Failed to delete ticket');
  }
});

// Messages Routes
app.get('/api/v1/messages', authenticate, async (req, res) => {
  try {
    let messagesQuery = db.collection('messages');

    if (req.userData.type === 'RESIDENT') {
      // for regular users, we need to find messages for tickets they own
      const userTicketsSnapshot = await db.collection('tickets')
        .where('createdBy', '==', req.user.uid)
        .get();

      const userTicketIds = [];
      userTicketsSnapshot.forEach(doc => {
        userTicketIds.push(doc.id);
      });

      if (userTicketIds.length === 0) {
        return res.status(200).json([]);
      }

      messagesQuery = messagesQuery.where('ticket', 'in', userTicketIds);
    }

    const messagesSnapshot = await messagesQuery.get();
    const messages = [];

    messagesSnapshot.forEach(doc => {
      messages.push({ id: doc.id, ...doc.data() });
    });

    return res.status(200).json(messages);
  } catch (error) {
    return handleApiError(res, error, 'Failed to get messages');
  }
});

app.post('/api/v1/messages', authenticate, async (req, res) => {
  try {
    // check if ticket exists and user has access
    const ticketRef = db.collection('tickets').doc(req.body.ticket);
    const ticketDoc = await ticketRef.get();

    if (!ticketDoc.exists) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const ticketData = ticketDoc.data();

    if (req.userData.type === 'RESIDENT' && ticketData.createdBy !== req.user.uid) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const messageData = {
      ticket: req.body.ticket,
      content: req.body.content,
      createdBy: req.user.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const messageRef = await db.collection('messages').add(messageData);
    const newMessage = { id: messageRef.id, ...messageData };

    return res.status(201).json(newMessage);
  } catch (error) {
    return handleApiError(res, error, 'Failed to create message');
  }
});

app.get('/api/v1/messages/:id', authenticate, async (req, res) => {
  try {
    const messageDoc = await db.collection('messages').doc(req.params.id).get();

    if (!messageDoc.exists) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    const messageData = messageDoc.data();

    if (req.userData.type === 'RESIDENT') {
      const ticketRef = db.collection('tickets').doc(messageData.ticket);
      const ticketDoc = await ticketRef.get();

      if (!ticketDoc.exists || ticketDoc.data().createdBy !== req.user.uid) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    return res.status(200).json({ id: messageDoc.id, ...messageData });
  } catch (error) {
    return handleApiError(res, error, 'Failed to get message');
  }
});

app.put('/api/v1/messages/:id', authenticate, async (req, res) => {
  try {
    const messageRef = db.collection('messages').doc(req.params.id);
    const messageDoc = await messageRef.get();

    if (!messageDoc.exists) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    const messageData = messageDoc.data();

    if (req.userData.type === 'RESIDENT') {
      const ticketRef = db.collection('tickets').doc(messageData.ticket);
      const ticketDoc = await ticketRef.get();

      if (!ticketDoc.exists || ticketDoc.data().createdBy !== req.user.uid) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    const updatedMessageData = {
      content: req.body.content
    };

    await messageRef.update(updatedMessageData);

    return res.status(200).json({
      id: messageRef.id,
      ticket: messageData.ticket,
      content: req.body.content,
      createdBy: messageData.createdBy,
      createdAt: messageData.createdAt
    });
  } catch (error) {
    return handleApiError(res, error, 'Failed to update message');
  }
});

app.delete('/api/v1/messages/:id', authenticate, async (req, res) => {
  try {
    const messageRef = db.collection('messages').doc(req.params.id);
    const messageDoc = await messageRef.get();

    if (!messageDoc.exists) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    const messageData = messageDoc.data();

    if (req.userData.type === 'RESIDENT') {
      const ticketRef = db.collection('tickets').doc(messageData.ticket);
      const ticketDoc = await ticketRef.get();

      if (!ticketDoc.exists || ticketDoc.data().createdBy !== req.user.uid) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    await messageRef.delete();

    return res.status(204).send();
  } catch (error) {
    return handleApiError(res, error, 'Failed to delete message');
  }
});

// Users Routes
app.get('/api/v1/users', authenticate, isEmployeeOrAdmin, async (req, res) => {
    try {
        let usersQuery = db.collection('users');

        if (req.userData.type === 'EMPLOYEE') {
            usersQuery = usersQuery.where('type', '==', 'RESIDENT');
        }

        const usersSnapshot = await usersQuery.get();
        const users = [];

        usersSnapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });

        return res.status(200).json(users);
    } catch (error) {
        return handleApiError(res, error, 'Failed to get users');
    }
});

app.post('/api/v1/users', authenticate, isEmployeeOrAdmin, async (req, res) => {
    try {
        if (req.userData.type === 'EMPLOYEE' && req.body.type && req.body.type !== 'RESIDENT') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const userRecord = await admin.auth().createUser({
            email: req.body.email,
            password: req.body.password || Math.random().toString(36).substring(2, 15),
            displayName: `${req.body.firstName} ${req.body.lastName}`
        });

        const userData = {
            id: userRecord.uid,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone || null,
            address: req.body.address || null,
            type: req.body.type || 'RESIDENT',
            imageURL: req.body.imageURL || null, // Add imageURL
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            createdBy: req.user.uid,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedBy: req.user.uid
        };

        await db.collection('users').doc(userRecord.uid).set(userData);

        return res.status(201).json({ id: userRecord.uid, ...userData });
    } catch (error) {
        return handleApiError(res, error, 'Failed to create user');
    }
});

app.get('/api/v1/users/:id', authenticate, isEmployeeOrAdmin, async (req, res) => {
    try {
        const userDoc = await db.collection('users').doc(req.params.id).get();

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const userData = userDoc.data();

        if (req.userData.type === 'EMPLOYEE' && userData.type !== 'RESIDENT') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        return res.status(200).json({ id: userDoc.id, ...userData });
    } catch (error) {
        return handleApiError(res, error, 'Failed to get user');
    }
});

app.put('/api/v1/users/:id', authenticate, isEmployeeOrAdmin, async (req, res) => {
    try {
        const userRef = db.collection('users').doc(req.params.id);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const existingUserData = userDoc.data();

        if (req.userData.type === 'EMPLOYEE' && existingUserData.type !== 'RESIDENT') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        const updatedUserData = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phone: req.body.phone || null,
          address: req.body.address || null,
          type: req.body.type,  // allow type update for admins
          imageURL: req.body.imageURL || null, // Add imageURL
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedBy: req.user.uid
        };

        if (req.user.uid === req.params.id && req.body.type && req.body.type !== existingUserData.type) {
            return res.status(403).json({ success: false, message: 'Cannot change own user type' });
        }
        if(req.userData.type !== 'ADMIN') {
            delete updatedUserData.type;
        }


        await userRef.update(updatedUserData);

        if (req.body.email && req.body.email !== existingUserData.email) {
            await admin.auth().updateUser(req.params.id, {
                email: req.body.email,
                displayName: `${req.body.firstName} ${req.body.lastName}`
            });
        }

        return res.status(200).json({
            id: userRef.id,
            ...updatedUserData,
            createdAt: existingUserData.createdAt,
            createdBy: existingUserData.createdBy
        });

    } catch (error) {
        return handleApiError(res, error, 'Failed to update user');
    }
});

app.delete('/api/v1/users/:id', authenticate, isEmployeeOrAdmin, async (req, res) => {
    try {
        const userRef = db.collection('users').doc(req.params.id);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const existingUserData = userDoc.data();

        if (req.userData.type === 'EMPLOYEE' && existingUserData.type !== 'RESIDENT') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        await userRef.delete();
        await admin.auth().deleteUser(req.params.id);

        return res.status(204).send();
    } catch (error) {
      return handleApiError(res, error, 'Failed to delete user');
    }
});

// settings routes
app.get('/api/v1/settings', async (req, res) => { 
  try {
    const settingsDoc = await db.collection('settings').doc('settings').get();

    if (!settingsDoc.exists) {
        return res.status(200).json({ announcementText: '' });
    }
    if (req.headers.authorization) {
          try {
              const token = req.headers.authorization.split('Bearer ')[1];
              const decodedToken = await admin.auth().verifyIdToken(token);
              req.user = decodedToken;

              const userDoc = await db.collection('users').doc(decodedToken.uid).get();
              if (userDoc.exists) {
                req.userData = userDoc.data();
              }

            if (req.userData && req.userData.type === 'ADMIN') {
                return res.status(200).json(settingsDoc.data());
            }
        } catch (authError) {
            console.error("Token verification error:", authError);
          }
    }
    return res.status(200).json({ announcementText: settingsDoc.data().announcementText || '' });

  } catch (error) {
    console.error('Get settings error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.put('/api/v1/settings', authenticate, isAdmin, async (req, res) => {
    try {
        const settingsRef = db.collection('settings').doc('settings');
        const settingsDoc = await settingsRef.get();

        const settingsData = {
            googleGeminiKey: req.body.googleGeminiKey,
            facebookPageId: req.body.facebookPageId,
            facebookAccessToken: req.body.facebookAccessToken,
            announcementText: req.body.announcementText, // Add announcementText
        };

        if (!settingsDoc.exists) {
            await settingsRef.set(settingsData);
        } else {
            await settingsRef.update(settingsData);
        }

        return res.status(200).json(settingsData);
    } catch (error) {
        return handleApiError(res, error, 'Failed to update settings');
    }
});

// Host static files
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});