const { db } = require('../services/firebase.service');
const { AppError } = require('../utils/errorHandler');

const pagesCollection = db.collection('pages');

exports.createPage = async (pageData) => {
    try {
      const docRef = await pagesCollection.add(pageData);
      return docRef.id;
    } catch(error) {
        throw new AppError("Failed to create Page", 500, error);
    }

};

exports.getPageBySlug = async (slug) => {
    try {
      const snapshot = await pagesCollection.where('slug', '==', slug).limit(1).get();
      if (snapshot.empty) {
        return null; // Or throw a 404 error
      }
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
        throw new AppError("Failed to get Page", 500, error)
    }
};

exports.getAllPages = async () => {
    try {
        const snapshot = await pagesCollection.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        throw new AppError("Failed to get all Pages", 500, error)
    }
};

exports.updatePage = async (id, updatedData) => {
    try {
      await pagesCollection.doc(id).update(updatedData);
    } catch (error) {
        throw new AppError("Failed to update Page", 500, error)
    }
};

exports.deletePage = async (id) => {
    try {
        await pagesCollection.doc(id).delete();
    } catch (error) {
        throw new AppError("Failed to delete Page", 500, error)
    }

};