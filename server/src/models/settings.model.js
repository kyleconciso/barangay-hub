const { db } = require('../services/firebase.service');
const { AppError } = require('../utils/errorHandler');

const settingsCollection = db.collection('settings');

exports.getSettings = async () => {
  try {
    const doc = await settingsCollection.doc('server').get(); // Assuming a single document named 'server'
    if (!doc.exists) {
      return {}; // Return an empty object if no settings exist yet.
    }
    return doc.data();
  } catch (error) {
      throw new AppError("Failed to get Settings", 500, error);
  }
};

exports.updateSettings = async (updatedSettings) => {
  try {
    await settingsCollection.doc('server').set(updatedSettings, { merge: true }); // Use set with merge to update specific fields
  } catch (error) {
      throw new AppError("Failed to update Settings", 500, error);
  }
};