require('dotenv').config();
const mongoose = require('mongoose');
const seedData = require('./utils/seedData');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  return seedData();
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
}); 