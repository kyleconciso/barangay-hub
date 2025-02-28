require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  firebaseConfig: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  },
  jwtSecret: process.env.JWT_SECRET,
};

module.exports = config;