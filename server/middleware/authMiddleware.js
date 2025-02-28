const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid authorization header' } });
        }

        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await getAuth().verifyIdToken(idToken);
        const userId = decodedToken.uid;

        // fetch user from firestore
        const db = getFirestore();
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'User not found' } });
        }
        // check if user is disabled
        const userData = userDoc.data();
        if (userData.disabled) {
            return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'User is disabled' } });
        }

        req.user = { id: userId, ...userDoc.data() }; // add user to req
        next(); // next

    } catch (error) {
        console.error('Authentication error:', error);
        next({ code: 'UNAUTHORIZED', message: 'Invalid token', status: 401 });
    }
};
module.exports = { authMiddleware };