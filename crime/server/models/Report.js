const admin = require('firebase-admin');

const db = admin.firestore();
const reportsCollection = db.collection('reports');

const createReport = async (reportData) => {
  const reportRef = await reportsCollection.add({
    userId: reportData.userId,
    crimeType: reportData.crimeType,
    description: reportData.description,
    location: reportData.location,
    latitude: reportData.latitude || null,
    longitude: reportData.longitude || null,
    time: reportData.time,
    status: 'pending',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return reportRef.id;
};

const getReportById = async (reportId) => {
  const reportDoc = await reportsCollection.doc(reportId).get();
  if (!reportDoc.exists) {
    return null;
  }
  return { id: reportDoc.id, ...reportDoc.data() };
};

const getUserReports = async (userId) => {
  const snapshot = await reportsCollection
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getAllReports = async (limit = 100) => {
  const snapshot = await reportsCollection
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const updateReport = async (reportId, updates) => {
  await reportsCollection.doc(reportId).update({
    ...updates,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
};

const deleteReport = async (reportId) => {
  await reportsCollection.doc(reportId).delete();
};

module.exports = {
  createReport,
  getReportById,
  getUserReports,
  getAllReports,
  updateReport,
  deleteReport
};