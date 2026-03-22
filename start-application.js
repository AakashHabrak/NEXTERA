const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Simple API endpoints for testing
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    // Demo credentials
    if (email === 'demo@nextera.com' && password === 'demo123') {
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token: 'demo-token-' + Date.now(),
                user: {
                    id: 'demo-1',
                    email: 'demo@nextera.com',
                    fullName: 'Demo User',
                    role: 'user'
                }
            }
        });
    } else if (email === 'admin@nextera.com' && password === 'admin123') {
        res.json({
            success: true,
            message: 'Admin login successful',
            data: {
                token: 'admin-token-' + Date.now(),
                user: {
                    id: 'admin-1',
                    email: 'admin@nextera.com',
                    fullName: 'Admin User',
                    role: 'admin'
                }
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
});

app.post('/api/auth/register', (req, res) => {
    const { fullName, email, password } = req.body;
    
    if (!fullName || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }
    
    res.json({
        success: true,
        message: 'Registration successful',
        data: {
            id: Date.now().toString(),
            email: email,
            fullName: fullName,
            role: 'user'
        }
    });
});

app.get('/api/auth/profile', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided'
        });
    }
    
    res.json({
        success: true,
        data: {
            id: 'demo-user',
            email: 'demo@nextera.com',
            fullName: 'Demo User',
            role: 'user'
        }
    });
});

// Mock API endpoints for admin panel
app.get('/api/events/stats/overview', (req, res) => {
    res.json({
        success: true,
        data: {
            totalEvents: 5,
            pendingEvents: 2,
            confirmedEvents: 3
        }
    });
});

app.get('/api/events', (req, res) => {
    res.json({
        success: true,
        data: [
            {
                _id: '1',
                name: 'Demo Event',
                email: 'demo@nextera.com',
                eventType: 'Wedding',
                eventDate: new Date().toISOString(),
                status: 'confirmed'
            }
        ]
    });
});

app.get('/api/contact', (req, res) => {
    res.json({
        success: true,
        data: [
            {
                _id: '1',
                name: 'Demo Contact',
                email: 'contact@demo.com',
                subject: 'Test Message',
                message: 'This is a test message',
                status: 'new',
                createdAt: new Date().toISOString()
            }
        ]
    });
});

app.get('/api/testimonials', (req, res) => {
    res.json({
        success: true,
        data: []
    });
});

app.get('/api/auth/users', (req, res) => {
    res.json({
        success: true,
        data: [
            {
                _id: '1',
                email: 'demo@nextera.com',
                fullName: 'Demo User',
                role: 'user',
                isActive: true,
                createdAt: new Date().toISOString()
            }
        ]
    });
});

// Route handlers
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/test-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'test-login.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 Test Server Started Successfully!');
    console.log('🌐 Visit: http://localhost:3000');
    console.log('');
    console.log('📋 Test Pages:');
    console.log('  • Homepage: http://localhost:3000');
    console.log('  • Login: http://localhost:3000/login');
    console.log('  • Registration: http://localhost:3000/register');
    console.log('  • Admin Panel: http://localhost:3000/admin');
    console.log('  • Test Login: http://localhost:3000/test-login');
    console.log('');
    console.log('🔐 Demo Credentials:');
    console.log('  • User Login: demo@nextera.com / demo123');
    console.log('  • Admin Login: admin@nextera.com / admin123');
    console.log('');
    console.log('✅ All systems are working!');
    console.log('   - No MongoDB required');
    console.log('   - No database setup needed');
    console.log('   - Works completely offline');
});
