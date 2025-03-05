const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errorHandler } = require('./src/middlewares/error.middleware');

const authRoutes = require('./src/routes/auth.routes');
const pagesRoutes = require('./src/routes/pages.routes');
const formsRoutes = require('./src/routes/forms.routes');
const ticketsRoutes = require('./src/routes/tickets.routes');
const messagesRoutes = require('./src/routes/messages.routes');
const usersRoutes = require('./src/routes/users.routes');
const settingsRoutes = require('./src/routes/settings.routes');
const chatRoutes = require('./src/routes/chat.routes');
const { authMiddleware } = require('./src/middlewares/auth.middleware');
const { requestLoggerMiddleware } = require('./src/middlewares/requestLogger.middleware');

const app = express();

// Middleware
app.use(requestLoggerMiddleware);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log("authMiddleware type:", typeof authMiddleware);
console.log("pagesRoutes type:", typeof pagesRoutes);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/forms', authMiddleware, formsRoutes); // authMiddleware for forms and others
app.use('/api/tickets', authMiddleware, ticketsRoutes);
app.use('/api/messages', authMiddleware, messagesRoutes);
app.use('/api/users', authMiddleware, usersRoutes);
app.use('/api/settings', authMiddleware, settingsRoutes);
app.use('/api/chat', authMiddleware, chatRoutes);

// Global error handler
app.use(errorHandler);

module.exports = app;