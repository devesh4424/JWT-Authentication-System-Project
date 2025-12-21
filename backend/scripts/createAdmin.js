const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import User model
const User = require('../models/User');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get email from command line arguments
    const email = process.argv[2];
    if (!email) {
      console.error('❌ Error: Please provide an email address');
      console.log('Usage: node createAdmin.js user@example.com');
      process.exit(1);
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`❌ Error: User with email "${email}" not found`);
      console.log('Please make sure the user exists in the database');
      process.exit(1);
    }

    // Check if already admin
    if (user.role === 'admin') {
      console.log(`ℹ️  User "${email}" is already an admin`);
      process.exit(0);
    }

    // Update role to admin
    user.role = 'admin';
    await user.save();

    console.log(`✅ Success! User "${email}" is now an admin`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
  }
};

createAdmin();

