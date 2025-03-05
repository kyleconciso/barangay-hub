// to avoid circular dependenies and allow mock testing
const { db, auth } = require('../config/firebase.config');

module.exports = { db, auth };