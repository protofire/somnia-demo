const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();

// Configuration for Vercel (environment variables only)
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0x49E389D79401D404cd4FBA55CC831a8224A0C277';
const SUBGRAPH_URL = process.env.SUBGRAPH_URL || 'http://localhost:8000/subgraphs/name/counter-subgraph';
const NETWORK = process.env.NETWORK || 'somnia-testnet';

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://*.vercel.app'],
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Serve the main counter page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Serve the leaderboard page
app.get('/leaderboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'leaderboard.html'));
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
        network: NETWORK
    });
});

// Export for Vercel
module.exports = app; 