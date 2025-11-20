const admin = require('firebase-admin');

const db = admin.firestore();
const usersCollection = db.collection('users');

const createUser = async (userData) => {
  const userRef = usersCollection.doc(userData.uid);
  await userRef.set({
    email: userData.email,
    name: userData.name,
    photoURL: userData.photoURL || null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return userRef.id;
};

const getUserById = async (uid) => {
  const userDoc = await usersCollection.doc(uid).get();
  if (!userDoc.exists) {
    return null;
  }
  return { id: userDoc.id, ...userDoc.data() };
};

const getUserByEmail = async (email) => {
  const snapshot = await usersCollection.where('email', '==', email).limit(1).get();
  if (snapshot.empty) {
    return null;
  }
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

const updateUser = async (uid, updates) => {
  await usersCollection.doc(uid).update({
    ...updates,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
};

const deleteUser = async (uid) => {
  await usersCollection.doc(uid).delete();
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser
};