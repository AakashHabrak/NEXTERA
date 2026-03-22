// Simple Node.js Server for NextEra Event Planner
// This server works without external dependencies

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// In-memory storage for events and contacts
let events = [];
let contacts = [];
let users = [
    {
        id: '1',
        email: 'admin@nextera.com',
        username: 'admin@nextera.com',
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

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Helper function to get MIME type
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'application/octet-stream';
}

// Helper function to serve static files
function serveStaticFile(res, filePath) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
            return;
        }
        
        const mimeType = getMimeType(filePath);
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(data);
    });
}

// Helper function to parse JSON body
function parseJSONBody(req, callback) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            callback(null, data);
        } catch (error) {
            callback(error, null);
        }
    });
}

// API Routes
function handleAPI(req, res, pathname) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    res.setHeader('Content-Type', 'application/json');
    
    // Events API
    if (pathname === '/api/events') {
        if (req.method === 'GET') {
            // Get all events
            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                data: events,
                pagination: {
                    current: 1,
                    pages: 1,
                    total: events.length
                }
            }));
        } else if (req.method === 'POST') {
            // Create new event
            parseJSONBody(req, (err, data) => {
                if (err) {
                    res.writeHead(400);
                    res.end(JSON.stringify({
                        success: false,
                        message: 'Invalid JSON data'
                    }));
                    return;
                }
                
                const newEvent = {
                    id: Date.now().toString(),
                    ...data,
                    status: 'pending',
                    createdAt: new Date().toISOString()
                };
                
                events.push(newEvent);
                
                res.writeHead(201);
                res.end(JSON.stringify({
                    success: true,
                    message: 'Event registration successful! We will contact you soon.',
                    data: {
                        id: newEvent.id,
                        name: newEvent.name,
                        eventType: newEvent.eventType,
                        eventDate: newEvent.eventDate,
                        status: newEvent.status
                    }
                }));
            });
        }
    }
    // Contact API
    else if (pathname === '/api/contact') {
        if (req.method === 'GET') {
            // Get all contacts
            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                data: contacts,
                pagination: {
                    current: 1,
                    pages: 1,
                    total: contacts.length
                }
            }));
        } else if (req.method === 'POST') {
            // Create new contact
            parseJSONBody(req, (err, data) => {
                if (err) {
                    res.writeHead(400);
                    res.end(JSON.stringify({
                        success: false,
                        message: 'Invalid JSON data'
                    }));
                    return;
                }
                
                const newContact = {
                    id: Date.now().toString(),
                    ...data,
                    status: 'pending',
                    createdAt: new Date().toISOString()
                };
                
                contacts.push(newContact);
                
                res.writeHead(201);
                res.end(JSON.stringify({
                    success: true,
                    message: 'Message sent successfully! We will get back to you within 24 hours.',
                    data: {
                        id: newContact.id,
                        name: newContact.name,
                        email: newContact.email,
                        subject: newContact.subject,
                        status: newContact.status
                    }
                }));
            });
        }
    }
    // Auth API
    else if (pathname === '/api/auth/register') {
        if (req.method === 'POST') {
            parseJSONBody(req, (err, data) => {
                if (err) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ success: false, message: 'Invalid JSON data' }));
                    return;
                }

                const { fullName, email, password, newsletter } = data || {};
                if (!fullName || !email || !password) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ success: false, message: 'Full name, email, and password are required' }));
                    return;
                }

                const exists = users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
                if (exists) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ success: false, message: 'User with this email already exists' }));
                    return;
                }

                const firstName = String(fullName).split(' ')[0] || fullName;
                const lastName = String(fullName).split(' ').slice(1).join(' ') || '';
                const user = {
                    id: Date.now().toString(),
                    email,
                    username: email,
                    password, // demo only
                    firstName,
                    lastName,
                    role: 'user',
                    isActive: true,
                    newsletter: !!newsletter,
                    createdAt: new Date().toISOString(),
                    lastLogin: null
                };
                users.push(user);

                res.writeHead(201);
                res.end(JSON.stringify({
                    success: true,
                    message: 'Registration successful! You can now log in.',
                    data: {
                        id: user.id,
                        email: user.email,
                        fullName: `${user.firstName} ${user.lastName}`.trim(),
                        role: user.role
                    }
                }));
            });
        }
    }
    else if (pathname === '/api/auth/login') {
        if (req.method === 'POST') {
            parseJSONBody(req, (err, data) => {
                if (err) {
                    res.writeHead(400);
                    res.end(JSON.stringify({
                        success: false,
                        message: 'Invalid JSON data'
                    }));
                    return;
                }
                
                const user = users.find(u => u.email.toLowerCase() === String(data.email).toLowerCase() && u.password === data.password);
                
                if (user) {
                    user.lastLogin = new Date().toISOString();
                    res.writeHead(200);
                    res.end(JSON.stringify({
                        success: true,
                        message: 'Login successful',
                        data: {
                            user: {
                                id: user.id,
                                email: user.email,
                                username: user.username,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                fullName: `${user.firstName} ${user.lastName}`.trim(),
                                role: user.role,
                                lastLogin: user.lastLogin
                            },
                            token: 'mock-jwt-token-' + Date.now()
                        }
                    }));
                } else {
                    res.writeHead(401);
                    res.end(JSON.stringify({
                        success: false,
                        message: 'Invalid email or password'
                    }));
                }
            });
        }
    }
    else if (pathname === '/api/auth/profile') {
        if (req.method === 'GET') {
            const user = users[0]; // return admin for demo
            res.writeHead(200);
            res.end(JSON.stringify({ success: true, data: user }));
        }
    }
    else if (pathname === '/api/auth/users') {
        if (req.method === 'GET') {
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
            res.writeHead(200);
            res.end(JSON.stringify({ success: true, data: safeUsers }));
        }
    }
    // Admin API
    else if (pathname === '/api/admin/stats' || pathname === '/api/events/stats/overview') {
        if (req.method === 'GET') {
            const stats = {
                totalEvents: events.length,
                pendingEvents: events.filter(e => e.status === 'pending').length,
                confirmedEvents: events.filter(e => e.status === 'confirmed').length,
                completedEvents: events.filter(e => e.status === 'completed').length,
                totalContacts: contacts.length,
                pendingContacts: contacts.filter(c => c.status === 'pending').length,
                totalUsers: users.length
            };
            
            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                data: {
                    ...stats,
                    eventTypesStats: [],
                    monthlyStats: []
                }
            }));
        }
    }
    // 404 for unknown API routes
    else {
        res.writeHead(404);
        res.end(JSON.stringify({
            success: false,
            message: 'API endpoint not found'
        }));
    }
}

// Main server handler
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    console.log(`${req.method} ${pathname}`);
    
    // Handle API routes
    if (pathname.startsWith('/api/')) {
        handleAPI(req, res, pathname);
        return;
    }
    
    // Handle static files
    let filePath;
    
    if (pathname === '/' || pathname === '/index.html') {
        filePath = path.join(PUBLIC_DIR, 'index.html');
    } else if (pathname === '/services' || pathname === '/services.html') {
        filePath = path.join(PUBLIC_DIR, 'services.html');
    } else if (pathname === '/about' || pathname === '/about.html') {
        filePath = path.join(PUBLIC_DIR, 'about.html');
    } else if (pathname === '/contact' || pathname === '/contact.html') {
        filePath = path.join(PUBLIC_DIR, 'contact.html');
    } else if (pathname === '/login' || pathname === '/login.html') {
        filePath = path.join(PUBLIC_DIR, 'login.html');
    } else if (pathname === '/register' || pathname === '/register.html') {
        filePath = path.join(PUBLIC_DIR, 'register.html');
    } else if (pathname === '/admin' || pathname === '/admin.html') {
        filePath = path.join(PUBLIC_DIR, 'admin.html');
    } else if (pathname === '/profile' || pathname === '/profile.html') {
        filePath = path.join(PUBLIC_DIR, 'profile.html');
    } else {
        // Try to serve the file directly
        filePath = path.join(PUBLIC_DIR, pathname);
    }
    
    // Security check - prevent directory traversal
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found, serve index.html for SPA routing
            const indexPath = path.join(PUBLIC_DIR, 'index.html');
            serveStaticFile(res, indexPath);
        } else {
            serveStaticFile(res, filePath);
        }
    });
});

// Start server
server.listen(PORT, () => {
    console.log('🚀 NextEra Event Planner Server Started!');
    console.log(`🌐 Server running on: http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${PUBLIC_DIR}`);
    console.log('📊 API Endpoints:');
    console.log('   POST /api/events - Create event booking');
    console.log('   GET  /api/events - Get all events');
    console.log('   POST /api/contact - Send contact message');
    console.log('   GET  /api/contact - Get all contacts');
    console.log('   POST /api/auth/login - User login');
    console.log('   GET  /api/admin/stats - Admin statistics');
    console.log('');
    console.log('🔑 Default Admin Login:');
    console.log('   Email: admin@nextera.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('Press Ctrl+C to stop the server');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});





