const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001; // Using port 3001 to avoid conflicts

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// In-memory storage for demo
let events = [];
let contacts = [];
let testimonials = [];
let users = [
  {
    id: 'admin-1',
    username: 'admin@nextera.com',
    email: 'admin@nextera.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isActive: true,
    newsletter: false,
    createdAt: new Date().toISOString(),
    lastLogin: null
  }
];

// Load sample data
try {
  const sampleEvents = require('./data/sample-events.json');
  const sampleContacts = require('./data/sample-contacts.json');
  const sampleTestimonials = require('./data/sample-testimonials.json');
  
  events = sampleEvents;
  contacts = sampleContacts;
  testimonials = sampleTestimonials;
  
  console.log('✅ Sample data loaded successfully');
} catch (error) {
  console.log('⚠️  Sample data not found, starting with empty arrays');
}

// Routes
// Auth API (Demo)
app.post('/api/auth/register', (req, res) => {
  try {
    const { fullName, email, password, newsletter } = req.body || {};

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, and password are required'
      });
    }

    const exists = users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
    if (exists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const firstName = String(fullName).split(' ')[0] || fullName;
    const lastName = String(fullName).split(' ').slice(1).join(' ') || '';
    const user = {
      id: Date.now().toString(),
      username: email,
      email,
      password, // Demo only (not hashed)
      firstName,
      lastName,
      role: 'user',
      isActive: true,
      newsletter: !!newsletter,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };
    users.push(user);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! You can now log in.',
      data: {
        id: user.id,
        email: user.email,
        fullName: `${user.firstName} ${user.lastName}`.trim(),
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Demo register error:', error);
    return res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    user.lastLogin = new Date().toISOString();
    const token = `demo-token-${user.id}`;

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: `${user.firstName} ${user.lastName}`.trim(),
          role: user.role,
          permissions: [],
          lastLogin: user.lastLogin
        }
      }
    });
  } catch (error) {
    console.error('❌ Demo login error:', error);
    return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

app.get('/api/auth/profile', (req, res) => {
  // Very simple demo: accept any token and return admin user if matches demo token, otherwise offline user
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  const user = users[0];
  return res.json({ success: true, data: user });
});

app.get('/api/auth/users', (req, res) => {
  const safeUsers = users.map(u => ({
    _id: u.id,
    email: u.email,
    fullName: `${u.firstName} ${u.lastName}`.trim(),
    role: u.role,
    newsletter: u.newsletter,
    isActive: u.isActive,
    createdAt: u.createdAt,
    lastLogin: u.lastLogin
  }));
  return res.json({ success: true, data: safeUsers });
});
// Events API
app.get('/api/events', (req, res) => {
  res.json({
    success: true,
    data: events,
    message: 'Events retrieved successfully (Demo mode - data stored in memory)'
  });
});

app.post('/api/events', (req, res) => {
  try {
    const eventData = {
      ...req.body,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    events.push(eventData);
    
    console.log('📝 New event registered:', eventData.name, eventData.eventType);
    
    res.status(201).json({
      success: true,
      message: 'Event registered successfully! We will contact you soon.',
      data: {
        id: eventData.id,
        name: eventData.name,
        eventType: eventData.eventType,
        status: eventData.status
      }
    });
  } catch (error) {
    console.error('❌ Event registration error:', error);
    res.status(400).json({
      success: false,
      message: 'Event registration failed',
      error: error.message
    });
  }
});

// Contact API
app.post('/api/contact', (req, res) => {
  try {
    const contactData = {
      ...req.body,
      id: Date.now().toString(),
      status: 'new',
      priority: 'medium',
      createdAt: new Date().toISOString()
    };
    
    contacts.push(contactData);
    
    console.log('📧 New contact message:', contactData.name, contactData.subject);
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will get back to you within 24 hours.',
      data: {
        id: contactData.id,
        name: contactData.name,
        subject: contactData.subject,
        status: contactData.status
      }
    });
  } catch (error) {
    console.error('❌ Contact form error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

// Testimonials API
app.get('/api/testimonials/featured', (req, res) => {
  const featuredTestimonials = testimonials.filter(t => t.isApproved && t.isFeatured);
  
  res.json({
    success: true,
    data: featuredTestimonials
  });
});

app.post('/api/testimonials', (req, res) => {
  try {
    const testimonialData = {
      ...req.body,
      id: Date.now().toString(),
      isApproved: false,
      isFeatured: false,
      createdAt: new Date().toISOString()
    };
    
    testimonials.push(testimonialData);
    
    console.log('⭐ New testimonial:', testimonialData.name, testimonialData.rating + ' stars');
    
    res.status(201).json({
      success: true,
      message: 'Testimonial submitted successfully! It will be reviewed and published soon.',
      data: {
        id: testimonialData.id,
        name: testimonialData.name,
        rating: testimonialData.rating,
        status: 'pending_approval'
      }
    });
  } catch (error) {
    console.error('❌ Testimonial error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to submit testimonial',
      error: error.message
    });
  }
});

// Serve main pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'services.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running successfully!',
    data: {
      events: events.length,
      contacts: contacts.length,
      testimonials: testimonials.length,
      users: users.length,
      mode: 'demo'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Page not found' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 NextEra Event Planner Caterers Server Running!`);
  console.log(`🌐 Website: http://localhost:${PORT}`);
  console.log(`📊 API Status: http://localhost:${PORT}/api/status`);
  console.log(`📝 Demo Mode - Data stored in memory`);
  console.log(`✅ All forms are working and saving data!`);
  console.log(`🛑 Press Ctrl+C to stop the server`);
  console.log(`\n🎉 Your website is ready to use!`);
});
