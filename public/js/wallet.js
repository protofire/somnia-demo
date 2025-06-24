// Wallet Management Module
class WalletManager {
    constructor() {
        this.web3 = null;
        this.account = null;
        this.contract = null;
        this.isConnected = false;
    }

    async initialize() {
        // Wait for Web3 to load
        if (typeof Web3 === 'undefined') {
            throw new Error('Web3 library not loaded');
        }
        console.log('Web3 loaded successfully');
    }

    async connectWallet() {
        try {
            await this.initialize();
            
            if (typeof window.ethereum === 'undefined') {
                throw new Error('Please install MetaMask or another Web3 wallet');
            }

            // Request account access
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });

            if (accounts.length === 0) {
                throw new Error('No accounts found');
            }

            this.web3 = new Web3(window.ethereum);
            this.account = accounts[0];
            this.contract = new this.web3.eth.Contract(
                window.CONFIG.CONTRACT_ABI, 
                window.CONFIG.CONTRACT_ADDRESS
            );
            this.isConnected = true;

            console.log('Wallet connected:', this.account);
            return {
                success: true,
                account: this.account
            };

        } catch (error) {
            console.error('Error connecting wallet:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getCounter(address = null) {
        if (!this.isConnected || !this.contract) {
            throw new Error('Wallet not connected');
        }

        const userAddress = address || this.account;
        
        try {
            // Try API first (subgraph)
            const response = await fetch(`${window.CONFIG.API_BASE_URL}/api/counter/${userAddress}`);
            if (response.ok) {
                const data = await response.json();
                return data.count;
            } else {
                // Fallback to direct contract call
                const count = await this.contract.methods.getCounter(userAddress).call();
                return count;
            }
        } catch (error) {
            console.error('Error getting counter:', error);
            throw error;
        }
    }

    async incrementCounter() {
        if (!this.isConnected || !this.contract || !this.account) {
            throw new Error('Wallet not connected');
        }

        try {
            const result = await this.contract.methods.increment().send({ 
                from: this.account 
            });
            
            console.log('Transaction successful:', result);
            return {
                success: true,
                transactionHash: result.transactionHash
            };
        } catch (error) {
            console.error('Error incrementing counter:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async checkConnection() {
        if (typeof window.ethereum !== 'undefined') {
            const accounts = await window.ethereum.request({ 
                method: 'eth_accounts' 
            });
            
            if (accounts.length > 0) {
                return await this.connectWallet();
            }
        }
        return { success: false, error: 'No previous connection found' };
    }

    disconnect() {
        this.web3 = null;
        this.account = null;
        this.contract = null;
        this.isConnected = false;
    }
}

// Export for global use
window.WalletManager = WalletManager; 