const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const config = require('./config');
const { errorHandler } = require('./utils/errorHandlers'); // Import

// import routes
const authRoutes = require('./routes/auth');
const pageRoutes = require('./routes/pages');
const newsRoutes = require('./routes/news');
const requestRoutes = require('./routes/requests');
const ticketRoutes = require('./routes/tickets');
const userRoutes = require('./routes/users');
const employeeRoutes = require('./routes/employees');
const settingsRoutes = require('./routes/settings');
const requestLogger = require('./middleware/requestLogger');

// initialize Firebase Admin SDK
try {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: config.firebaseConfig.projectId,
            clientEmail: config.firebaseConfig.clientEmail,
            privateKey: config.firebaseConfig.privateKey.replace(/\\n/g, '\n'),
        }),
    });
    console.log('Firebase Admin SDK initialized successfully.');
} catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    process.exit(1);// exit init if fail
}

const app = express();

// middlewares
app.use(cors()); // for dev
app.use(express.json());// parse json reqs
app.use(requestLogger); // log reqs dev

// mount routes
app.use('/api/auth', authRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/settings', settingsRoutes);

app.use(errorHandler);

// start
const port = config.port;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});