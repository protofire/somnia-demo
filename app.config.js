const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

// Load configuration
const config = require('./config.example'); // Change to config.js when you create it

const app = express();
const PORT = config.port;

// Apply CORS configuration
app.use(cors(config.cors));
app.use(express.json());
app.use(express.static('public'));

// Contract configuration from config
const CONTRACT_ADDRESS = config.contractAddress;
const SUBGRAPH_URL = config.subgraphUrl;

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
        network: config.network
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📋 Contract Address: ${CONTRACT_ADDRESS}`);
    console.log(`📊 Subgraph URL: ${SUBGRAPH_URL}`);
    console.log(`🌐 Network: ${config.network}`);
}); 