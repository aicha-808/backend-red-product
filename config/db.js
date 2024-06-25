const mongoose = require('mongoose');

const connectDB = async () => {

  try {
    await mongoose.set('strictQuery', false)
    await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log('MongoDB Connected s');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
