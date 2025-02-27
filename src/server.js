import fetch from 'node-fetch';
import express from 'express';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const app = express();
const port = 3001; // Change the port number

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('src/public'));

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

// Create users table
db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, bio TEXT, avatarUrl TEXT)");
});

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
    
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, user) => {
        if (err) {
            console.error('Login error:', err);
            return res.status(500).json({ success: false, message: 'Server error during login' });
        }
        
        if (user) {
            res.json({ success: true, message: 'Login successful!' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials!' });
        }
    });
});

// Register endpoint
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) {
            console.error('Registration error:', err);
            return res.status(500).json({ success: false, message: 'Server error during registration' });
        }
        
        if (user) {
            return res.status(400).json({ success: false, message: 'Username already exists!' });
        }
        
        db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], (err) => {
            if (err) {
                console.error('Registration error:', err);
                return res.status(500).json({ success: false, message: 'Server error during registration' });
            }
            
            res.json({ success: true, message: 'Registration successful!' });
        });
    });
});

// Vulnerable admin endpoint - no proper authentication
app.get('/api/users', (req, res) => {
    db.all("SELECT * FROM users", (err, users) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        
        res.json(users);
    });
});

// Vulnerable to SQL Injection (if using a database) and IDOR
app.delete('/api/users/:id', (req, res) => {
    db.run("DELETE FROM users WHERE id = ?", [req.params.id], (err) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        
        res.json({ success: true });
    });
});

// Vulnerable to SSRF : Fetches data from any URL provided by the user
const allowedHosts = ["example.com", "api.example.com"];

app.get('/api/fetch', async (req, res) => {
    const { url } = req.query;

    try {
        const parsedUrl = new URL(url);
        if (!allowedHosts.includes(parsedUrl.hostname)) {
            return res.status(403).json({ error: "Forbidden URL" });
        }

        const response = await fetch(url);
        const data = await response.text();
        res.send(data);
    } catch (error) {
        res.status(400).json({ error: "Invalid request" });
    }
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
    db.run("UPDATE users SET avatarUrl = ?, bio = ? WHERE username = ?", [avatarUrl, bio, username], (err) => {
        if (err) {
            console.error('Error updating profile:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        
        res.json({ success: true, message: 'Profile updated!' });
    });
});

// User search - vulnerable to NoSQL injection
app.get('/api/users/search', (req, res) => {
    const { query } = req.query;
    db.all("SELECT * FROM users WHERE username LIKE ? OR bio LIKE ?", [`%${query}%`, `%${query}%`], (err, users) => {
        if (err) {
            console.error('Error searching users:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        
        res.json(users);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});