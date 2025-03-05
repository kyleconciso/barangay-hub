const { db } = require('../services/firebase.service');
const { AppError } = require('../utils/errorHandler');
const formsCollection = db.collection('forms');

exports.createForm = async (formData) => {
    try {
        const docRef = await formsCollection.add(formData);
        return docRef.id;
    } catch (error) {
        throw new AppError('Failed to create Form', 500, error);
    }
};

exports.getFormById = async (id) => {
    try {
        const doc = await formsCollection.doc(id).get();
        if (!doc.exists) {
            return null;
        }
        return { id: doc.id, ...doc.data() };
    } catch (error) {
        throw new AppError('Failed to get Form', 500, error);
    }
};

exports.getAllForms = async () => {
    try {
        const snapshot = await formsCollection.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        throw new AppError('Failed to get all Forms', 500, error);
    }
};


exports.updateForm = async (id, updatedData) => {
  try {
    await formsCollection.doc(id).update(updatedData);
  } catch (error) {
    throw new AppError("Failed to update Form", 500, error);
  }
};

exports.deleteForm = async (id) => {
  try {
    await formsCollection.doc(id).delete();
  } catch (error) {
    throw new AppError("Failed to delete Form", 500, error);
  }
};