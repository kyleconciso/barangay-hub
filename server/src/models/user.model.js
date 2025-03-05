const { db } = require('../services/firebase.service');
const { AppError } = require('../utils/errorHandler');

const usersCollection = db.collection('users');

exports.createUser = async (uid, userData) => {
  try {
    await usersCollection.doc(uid).set(userData); // Use UID as document ID
    return uid;
  } catch (error) {
      throw new AppError("Failed to create User", 500, error);
  }
};

exports.getUserById = async (id) => {
  try {
    const doc = await usersCollection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  } catch (error) {
      throw new AppError("Failed to get User", 500, error);
  }
};

exports.getUserByEmail = async (email) => {
    try {
        const snapshot = await usersCollection.where('email', '==', email).limit(1).get();
        if (snapshot.empty) {
            return null;
        }
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
    } catch (error) {
        throw new AppError('Failed to get User by Email', 500, error);
    }
};

exports.getAllUsers = async () => {
  try {
    const snapshot = await usersCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
      throw new AppError("Failed to get all Users", 500, error);
  }
};

exports.updateUser = async (id, updatedData) => {
  try {
    await usersCollection.doc(id).update(updatedData);
  } catch (error) {
      throw new AppError("Failed to update User", 500, error);
  }
};

exports.deleteUser = async (id) => {
  try {
    await usersCollection.doc(id).delete();
  } catch (error) {
      throw new AppError("Failed to delete User", 500, error);
  }
};