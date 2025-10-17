const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const Department = require('./models/Department');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aits_csms';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');

    const adminExists = await Admin.findOne({ email: 'admin@aits.edu' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('password', 10);
      
      const admin = new Admin({
        name: 'Super Admin',
        adminId: 'ADMIN001',
        email: 'admin@aits.edu',
        password: hashedPassword,
        role: 'Super Admin'
      });

      await admin.save();
      console.log('✅ Admin account created');
      console.log('Email: admin@aits.edu');
      console.log('Password: password');
    } else {
      console.log('Admin already exists');
    }

    const deptExists = await Department.findOne({ code: 'CSE' });
    if (!deptExists) {
      const departments = [
        { name: 'Computer Science Engineering', code: 'CSE' },
        { name: 'Electronics and Communication Engineering', code: 'ECE' },
        { name: 'Electrical and Electronics Engineering', code: 'EEE' },
        { name: 'Civil Engineering', code: 'CIVIL' },
        { name: 'Mechanical Engineering', code: 'MECH' },
        { name: 'Artificial Intelligence and Data Science', code: 'AIDS' }
      ];

      await Department.insertMany(departments);
      console.log('✅ Sample departments created');
    }

    console.log('✅ Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
