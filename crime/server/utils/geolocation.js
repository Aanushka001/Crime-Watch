const admin = require('firebase-admin');

const db = admin.firestore();
const reportsCollection = db.collection('reports');

const createReport = async (reportData) => {
  const reportRef = await reportsCollection.add({
    ...reportData,
    location: new admin.firestore.GeoPoint(reportData.latitude, reportData.longitude),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return reportRef;
};

const getReportsNearLocation = async (latitude, longitude, radiusInKm = 10) => {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  const latRange = radiusInKm / 111.32;
  const lngRange = radiusInKm / (111.32 * Math.cos(lat * Math.PI / 180));

  const snapshot = await reportsCollection
    .where('location', '>=', new admin.firestore.GeoPoint(lat - latRange, lng - lngRange))
    .where('location', '<=', new admin.firestore.GeoPoint(lat + latRange, lng + lngRange))
    .get();

  const reports = [];
  snapshot.forEach(doc => {
    reports.push({ id: doc.id, ...doc.data() });
  });

  return reports;
};

module.exports = {
  createReport,
  getReportsNearLocation
};