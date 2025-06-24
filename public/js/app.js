// Main Application Logic
class CounterApp {
    constructor() {
        this.walletManager = new WalletManager();
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.elements = {
            connectBtn: document.getElementById('connectBtn'),
            incrementBtn: document.getElementById('incrementBtn'),
            counter: document.getElementById('counter'),
            walletStatus: document.getElementById('walletStatus'),
            walletAddress: document.getElementById('walletAddress'),
            status: document.getElementById('status')
        };
    }

    bindEvents() {
        this.elements.connectBtn.addEventListener('click', () => this.connectWallet());
        this.elements.incrementBtn.addEventListener('click', () => this.incrementCounter());
        
        // Auto-connect on page load
        window.addEventListener('load', () => this.checkAutoConnect());
    }

    async connectWallet() {
        this.updateStatus('Connecting wallet...');
        
        const result = await this.walletManager.connectWallet();
        
        if (result.success) {
            this.onWalletConnected(result.account);
            await this.loadCounter();
        } else {
            this.updateStatus(`Error: ${result.error}`);
        }
    }

    onWalletConnected(account) {
        this.elements.walletStatus.textContent = 'Wallet Connected';
        this.elements.walletAddress.textContent = `Address: ${account}`;
        this.elements.connectBtn.style.display = 'none';
        this.elements.incrementBtn.disabled = false;
        this.updateStatus('Wallet connected successfully!');
    }

    async loadCounter() {
        if (!this.walletManager.isConnected) return;
        
        try {
            const count = await this.walletManager.getCounter();
            this.elements.counter.textContent = count;
        } catch (error) {
            console.error('Error loading counter:', error);
            this.updateStatus('Error loading counter');
        }
    }

    async incrementCounter() {
        this.updateStatus('Processing transaction...');
        this.elements.incrementBtn.disabled = true;
        
        try {
            const result = await this.walletManager.incrementCounter();
            
            if (result.success) {
                this.updateStatus('Transaction successful!');
                // Wait a moment then reload counter
                setTimeout(() => this.loadCounter(), 2000);
            } else {
                this.updateStatus(`Transaction failed: ${result.error}`);
            }
        } catch (error) {
            console.error('Error incrementing counter:', error);
            this.updateStatus('Transaction failed');
        } finally {
            this.elements.incrementBtn.disabled = false;
        }
    }

    async checkAutoConnect() {
        const result = await this.walletManager.checkConnection();
        if (result.success) {
            this.onWalletConnected(result.account);
            await this.loadCounter();
        }
    }

    updateStatus(message) {
        this.elements.status.textContent = message;
        console.log('Status:', message);
        
        // Clear status after 5 seconds
        setTimeout(() => {
            if (this.elements.status.textContent === message) {
                this.elements.status.textContent = '';
            }
        }, 5000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Counter App...');
    window.app = new CounterApp();
}); 