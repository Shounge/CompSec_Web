const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static('src/public'));

// Path to users.json
const usersFilePath = path.join(__dirname, 'data', 'users.json');
const documentsFilePath = path.join(__dirname, 'data', 'documents.json');

// Serve the main login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the dashboard page
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Serve the admin page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Read users from JSON file
        const userData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
        
        const user = userData.users.find(u => 
            u.username === username && u.password === password
        );
        
        if (user) {
            res.json({ success: true, message: 'Login successful!' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials!' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
});

// Register endpoint
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    
    // Read current users
    const userData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    
    // Check if username already exists
    if (userData.users.some(u => u.username === username)) {
        return res.status(400).json({ success: false, message: 'Username already exists!' });
    }
    
    // Add new user
    userData.users.push({ username, password });
    
    // Save back to file
    fs.writeFileSync(usersFilePath, JSON.stringify(userData, null, 4));
    
    res.json({ success: true, message: 'Registration successful!' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Vulnerable admin endpoint - no proper authentication
app.get('/api/users', (req, res) => {
    const userData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    res.json(userData.users);
});

// Vulnerable to SQL Injection (if using a database) and IDOR
app.delete('/api/users/:id', (req, res) => {
    const userData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    userData.users = userData.users.filter((_, index) => index !== parseInt(req.params.id));
    fs.writeFileSync(usersFilePath, JSON.stringify(userData, null, 4));
    res.json({ success: true });
});

// Vulnerable to SSRF
app.post('/api/fetch-avatar', (req, res) => {
    const { url } = req.body;
    fetch(url)
        .then(response => response.text())
        .then(data => res.send(data))
        .catch(error => res.status(500).json({ error: error.message }));
});

// Document endpoints - vulnerable to IDOR
app.get('/api/documents/:id', (req, res) => {
    const documents = JSON.parse(fs.readFileSync(documentsFilePath, 'utf8'));
    const document = documents.documents.find(d => d.id === parseInt(req.params.id));
    
    if (document) {
        res.json(document);
    } else {
        res.status(404).json({ message: 'Document not found' });
    }
});

// Profile update endpoint - vulnerable to XSS and CSRF
app.post('/api/profile/update', (req, res) => {
    const { username, avatarUrl, bio } = req.body;
    const userData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    const userIndex = userData.users.findIndex(u => u.username === username);
    
    if (userIndex !== -1) {
        userData.users[userIndex] = {
            ...userData.users[userIndex],
            avatarUrl,
            bio
        };
        fs.writeFileSync(usersFilePath, JSON.stringify(userData, null, 4));
        res.json({ success: true, message: 'Profile updated!' });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
});

// User search - vulnerable to NoSQL injection
app.get('/api/users/search', (req, res) => {
    const { query } = req.query;
    const userData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    const users = userData.users.filter(u => 
        u.username.includes(query) || u.bio?.includes(query)
    );
    res.json(users);
});
