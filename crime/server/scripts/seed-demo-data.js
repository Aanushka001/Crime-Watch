require('dotenv').config();

const mongoose = require('mongoose');
const Report = require('../models/Report');

const demoReports = [
  {
    _id: '670000000000000000000001',
    crimeType: 'Theft',
    description: '[DEMO ONLY - FICTIONAL] Sample theft record for the Crime Watch map and analytics preview.',
    location: 'Demo area - Egmore, Chennai',
    latitude: 13.0732,
    longitude: 80.2609,
    time: new Date('2026-10-19T08:30:00.000Z')
  },
  {
    _id: '670000000000000000000002',
    crimeType: 'Vandalism',
    description: '[DEMO ONLY - FICTIONAL] Sample vandalism record for the Crime Watch map and analytics preview.',
    location: 'Demo area - T. Nagar, Chennai',
    latitude: 13.0418,
    longitude: 80.2337,
    time: new Date('2026-10-20T14:15:00.000Z')
  },
  {
    _id: '670000000000000000000003',
    crimeType: 'Burglary',
    description: '[DEMO ONLY - FICTIONAL] Sample burglary record for the Crime Watch map and analytics preview.',
    location: 'Demo area - Mylapore, Chennai',
    latitude: 13.0337,
    longitude: 80.2696,
    time: new Date('2026-10-20T20:45:00.000Z')
  },
  {
    _id: '670000000000000000000004',
    crimeType: 'Vehicle Crime',
    description: '[DEMO ONLY - FICTIONAL] Sample vehicle crime record for the Crime Watch map and analytics preview.',
    location: 'Demo area - Anna Nagar, Chennai',
    latitude: 13.085,
    longitude: 80.2101,
    time: new Date('2026-10-21T04:20:00.000Z')
  }
].map((report) => ({
  ...report,
  isAnonymous: true,
  isDemo: true,
  geoLocation: {
    type: 'Point',
    coordinates: [report.longitude, report.latitude]
  },
  status: 'verified',
  reviewNote: 'Fictional sample record for local UI preview; not a real incident.',
  reviewedAt: new Date('2026-10-21T08:00:00.000Z'),
  createdAt: report.time,
  updatedAt: new Date('2026-10-21T08:00:00.000Z')
}));

const main = async () => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Demo data can only be inserted in a non-production environment');
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI must be configured before seeding demo data');
  }
  const { hostname } = new URL(uri);
  if (!['127.0.0.1', 'localhost', '::1'].includes(hostname)) {
    throw new Error('Demo data seeding is restricted to a local MongoDB server');
  }

  await mongoose.connect(uri);
  try {
    await Report.init();
    const operations = demoReports.map((report) => ({
      updateOne: {
        filter: { _id: new mongoose.Types.ObjectId(report._id), isDemo: true },
        update: { $set: report },
        upsert: true
      }
    }));

    const result = await Report.bulkWrite(operations);
    console.log(`Seeded ${demoReports.length} fictional demo reports into ${mongoose.connection.name}.`);
    console.log(`Inserted: ${result.upsertedCount}; updated: ${result.modifiedCount}.`);
  } finally {
    await mongoose.disconnect();
  }
};

main().catch((error) => {
  console.error('Failed to seed local demo reports:', error.message);
  process.exitCode = 1;
});
