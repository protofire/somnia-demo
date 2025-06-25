// Configuration template for Somnia Demo
// Copy this file to config.js and update the values as needed

module.exports = {
    // Server configuration
    port: process.env.PORT || 3000,
    
    // Network configuration
    network: 'somnia-testnet',
    
    // Contract configuration
    contractAddress: '0x56eb32579d0de82027bFD0351ac954088D66C98A',
    
    // Subgraph configuration
    subgraphUrl: 'https://proxy.somnia.chain.love/subgraphs/name/somnia-testnet/counter',
    
    // CORS configuration
    cors: {
        origin: ['*'],
        credentials: true
    },
    
    // RPC endpoints
    rpcUrls: {
        'somnia-testnet': 'https://dream-rpc.somnia.network'
    }
}; 