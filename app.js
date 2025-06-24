const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const fs = require('fs');

// Load configuration with fallback
let config;
try {
    // Try to load config.js first
    if (fs.existsSync('./config.js')) {
        config = require('./config.js');
    } else {
        // Fall back to config.example.js
        config = require('./config.example.js');
        console.log('⚠️  Using config.example.js - Please copy it to config.js and customize as needed');
    }
} catch (error) {
    console.error('❌ Error loading configuration:', error.message);
    process.exit(1);
}

const app = express();

// Use environment variables for production (Vercel) or config file for local development
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || config.contractAddress;
const SUBGRAPH_URL = process.env.SUBGRAPH_URL || config.subgraphUrl;
const NETWORK = process.env.NETWORK || config.network;
const PORT = process.env.PORT || config.port;

// CORS configuration - support both local development and production
const corsOrigins = process.env.NODE_ENV === 'production' 
    ? ['https://*.vercel.app', 'https://*.somnia.network']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
    origin: corsOrigins,
    credentials: true
}));

app.use(express.json());
app.use(express.static('public'));

// Serve the main counter page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the leaderboard page
app.get('/leaderboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'leaderboard.html'));
});

// API endpoint to get leaderboard data from subgraph
app.get('/api/leaderboard', async (req, res) => {
    try {
        const query = `
            {
                users(orderBy: count, orderDirection: desc) {
                    id
                    count
                    lastUpdated
                }
            }
        `;
        
        const response = await axios.post(SUBGRAPH_URL, {
            query: query
        });
        
        res.json(response.data.data.users || []);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard data' });
    }
});

// API endpoint to get user counter
app.get('/api/counter/:address', async (req, res) => {
    try {
        const address = req.params.address.toLowerCase();
        const query = `
            {
                user(id: "${address}") {
                    id
                    count
                    lastUpdated
                }
            }
        `;
        
        const response = await axios.post(SUBGRAPH_URL, {
            query: query
        });
        
        const user = response.data.data.user;
        res.json({ count: user ? user.count : 0 });
    } catch (error) {
        console.error('Error fetching user counter:', error);
        res.status(500).json({ error: 'Failed to fetch user counter' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        contractAddress: CONTRACT_ADDRESS,
        subgraphUrl: SUBGRAPH_URL,
        network: NETWORK,
        environment: process.env.NODE_ENV || 'development'
    });
});

// Only start server if not in serverless environment (Vercel)
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
        console.log(`📋 Contract Address: ${CONTRACT_ADDRESS}`);
        console.log(`📊 Subgraph URL: ${SUBGRAPH_URL}`);
        console.log(`🌐 Network: ${NETWORK}`);
        console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}

// Export for Vercel deployment
module.exports = app; 