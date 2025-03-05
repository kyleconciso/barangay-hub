const { db } = require('../services/firebase.service');
const { AppError } = require('../utils/errorHandler');

const ticketsCollection = db.collection('tickets');

exports.createTicket = async (ticketData) => {
  try {
    const docRef = await ticketsCollection.add(ticketData);
    return docRef.id;
  } catch (error) {
    throw new AppError("Failed to create Ticket", 500, error);
  }
};

exports.getTicketById = async (id) => {
  try {
    const doc = await ticketsCollection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    throw new AppError("Failed to get Ticket", 500, error);
  }
};

exports.getAllTickets = async () => {
  try {
    const snapshot = await ticketsCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
      throw new AppError("Failed to get all Tickets", 500, error);
  }
};

exports.getTicketsByCreator = async (creatorId) => {
    try {
        const snapshot = await ticketsCollection.where('createdBy', '==', creatorId).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        throw new AppError("Failed to get Tickets by Creator", 500, error)
    }
};

exports.updateTicket = async (id, updatedData) => {
  try {
    await ticketsCollection.doc(id).update(updatedData);
  } catch (error) {
      throw new AppError("Failed to update Ticket", 500, error);
  }
};

exports.deleteTicket = async (id) => {
  try {
    await ticketsCollection.doc(id).delete();
  } catch (error) {
      throw new AppError("Failed to delete Ticket", 500, error);
  }
};