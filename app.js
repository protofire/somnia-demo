const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Contract configuration (update these with your deployed contract details)
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0x...'; // Update this
const SUBGRAPH_URL = process.env.SUBGRAPH_URL || 'http://localhost:8000/subgraphs/name/counter-subgraph';

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

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Contract Address: ${CONTRACT_ADDRESS}`);
    console.log(`Subgraph URL: ${SUBGRAPH_URL}`);
}); 