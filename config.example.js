// Configuration template for Somnia Demo
// Copy this file to config.js and update the values as needed

module.exports = {
    // Server configuration
    port: process.env.PORT || 3000,
    
    // Network configuration
    network: 'somnia-testnet',
    
    // Contract configuration
    contractAddress: '0x49E389D79401D404cd4FBA55CC831a8224A0C277',
    
    // Subgraph configuration
    subgraphUrl: 'https://proxy.somnia.chain.love/subgraphs/name/somnia-testnet/demo',
    
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