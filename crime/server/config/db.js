const mongoose = require('mongoose');
const User = require('../models/User');
const Report = require('../models/Report');

const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI must be configured before starting the API');
  }

  await mongoose.connect(uri);
  await Promise.all([User.init(), Report.init()]);
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
};

module.exports = connectDatabase;
