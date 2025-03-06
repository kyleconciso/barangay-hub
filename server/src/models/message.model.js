const { db } = require('../services/firebase.service');
const { AppError } = require('../utils/errorHandler');

const messagesCollection = db.collection('messages');

exports.createMessage = async (messageData) => {
  try {
    const docRef = await messagesCollection.add(messageData);
    return docRef.id;
  } catch (error) {
      throw new AppError("Failed to create Message", 500, error);
  }
};

exports.getMessageById = async (id) => {
  try {
    const doc = await messagesCollection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  } catch (error) {
      throw new AppError("Failed to get Message", 500, error);
  }
};

exports.getMessagesByTicket = async (ticketId) => {
  try {
    const snapshot = await messagesCollection.where('ticket', '==', ticketId).orderBy('createdAt', 'asc').get(); // 'ticket' field name is correct.
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
      throw new AppError("Failed to get Message by Ticket", 500, error); // Correct error message.
  }
};

exports.updateMessage = async (id, updatedData) => {
  try {
    await messagesCollection.doc(id).update(updatedData);
  } catch (error) {
      throw new AppError("Failed to update Message", 500, error);
  }
};

exports.deleteMessage = async (id) => {
  try {
    await messagesCollection.doc(id).delete();
  } catch (error) {
      throw new AppError("Failed to delete Message", 500, error);
  }
};