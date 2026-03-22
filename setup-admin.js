const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function setupAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elite-event-planner');
    console.log('✅ Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@nextera.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('Email: admin@nextera.com');
      console.log('Password: admin123');
    } else {
      // Create admin user
      const adminUser = new User({
        username: 'admin',
        email: 'admin@nextera.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
        permissions: ['read_events', 'write_events', 'delete_events', 'read_contacts', 'write_contacts', 'read_testimonials', 'write_testimonials', 'manage_users']
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully');
      console.log('Email: admin@nextera.com');
      console.log('Password: admin123');
    }

    // Also create a demo user for testing
    const existingDemo = await User.findOne({ email: 'demo@nextera.com' });
    
    if (!existingDemo) {
      const demoUser = new User({
        username: 'demo',
        email: 'demo@nextera.com',
        password: 'demo123',
        firstName: 'Demo',
        lastName: 'User',
        role: 'user',
        isActive: true,
        newsletter: true
      });

      await demoUser.save();
      console.log('✅ Demo user created successfully');
      console.log('Email: demo@nextera.com');
      console.log('Password: demo123');
    }

    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@nextera.com / admin123');
    console.log('Demo User: demo@nextera.com / demo123');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
    process.exit(0);
  }
}

setupAdmin();