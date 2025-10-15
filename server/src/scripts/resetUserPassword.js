import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { config } from '../config/env.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Reset password function
const resetPassword = async (email, newPassword) => {
  try {
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log(`❌ User with email ${email} not found`);
      return false;
    }

    console.log(`📧 Found user: ${user.username} (${user.email})`);
    console.log(`👤 Role: ${user.role}`);

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    console.log(`✅ Password successfully reset for ${email}`);
    console.log(`🔑 New password: ${newPassword}`);
    console.log(`⚠️  Please change this password after first login for security`);

    return true;

  } catch (error) {
    console.error('❌ Error resetting password:', error);
    return false;
  }
};

// Main execution
const main = async () => {
  // Get email and password from command line arguments
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('❌ Usage: node resetUserPassword.js <email> <new_password>');
    console.log('📝 Example: node resetUserPassword.js user@example.com MyNewPassword123!');
    process.exit(1);
  }

  const email = args[0];
  const newPassword = args[1];

  console.log('🔄 Starting password reset process...');
  console.log(`📧 Target email: ${email}`);
  console.log(`🔑 New password: ${newPassword}`);
  console.log('');

  await connectDB();
  const success = await resetPassword(email, newPassword);
  
  if (success) {
    console.log('');
    console.log('🏁 Password reset process completed');
    console.log('💡 The user can now login with the new password');
    console.log('🔒 Remember to change the password after first login');
  } else {
    console.log('');
    console.log('❌ Password reset failed');
  }
  
  process.exit(success ? 0 : 1);
};

// Run the script
main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
