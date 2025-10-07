import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { usePortfolio } from '../hooks/useAuth.js';
import Navbar from '../Navbar/Navbar.jsx';
import { User, Wallet, TrendingUp, TrendingDown, Activity, ArrowUpRight, ArrowDownLeft, BarChart3, LogOut } from 'lucide-react';
import './UserDashboard.css';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const { balance, cryptos, transactions } = usePortfolio();
    const [portfolioChange, setPortfolioChange] = useState({ value: 0, percentage: 0 });
    const [cryptoPrices, setCryptoPrices] = useState({});
    const [portfolioTotal, setPortfolioTotal] = useState(0);

    const cryptosList = Object.entries(cryptos);
    
    // Function to get the latest price for a crypto from transactions
    const getLatestCryptoPrice = (cryptoSymbol) => {
        // Find the most recent transaction for this crypto
        const cryptoTransactions = transactions.filter(tx => 
            tx.crypto?.toLowerCase() === cryptoSymbol.toLowerCase()
        );
        
        if (cryptoTransactions.length > 0) {
            // Get the most recent transaction price
            return cryptoTransactions[0].price;
        }
        
        // Fallback prices if no transaction found
        const fallbackPrices = { 
            bitcoin: 45000, btc: 45000,
            ethereum: 3000, eth: 3000,
            cardano: 0.5, ada: 0.5,
            polkadot: 25, dot: 25,
            binancecoin: 300, bnb: 300,
            solana: 100, sol: 100
        };
        
        return fallbackPrices[cryptoSymbol.toLowerCase()] || 0;
    };

    // Update crypto prices and portfolio total when transactions or cryptos change
    useEffect(() => {
        const prices = {};
        let cryptoValue = 0;
        
        Object.entries(cryptos).forEach(([crypto, amount]) => {
            const price = getLatestCryptoPrice(crypto);
            prices[crypto] = price;
            cryptoValue += price * amount;
        });
        
        setCryptoPrices(prices);
        setPortfolioTotal(balance + cryptoValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactions, cryptos, balance]);

    // Get recent transactions (real data from user's transaction history)
    const recentTransactions = transactions.slice(0, 5); // Show last 5 transactions

    // Calculate portfolio change based on transaction history
    useEffect(() => {
        if (transactions.length > 0) {
            // Simple calculation based on recent transactions
            const recentValue = transactions.slice(0, 5).reduce((total, tx) => {
                return total + (tx.type === 'buy' ? -tx.total : tx.total);
            }, 0);
            
            const percentage = portfolioTotal > 0 ? (recentValue / portfolioTotal) * 100 : 0;
            setPortfolioChange({ value: recentValue, percentage: percentage });
        } else {
            setPortfolioChange({ value: 0, percentage: 0 });
        }
    }, [transactions, portfolioTotal]);



    const getUserInitials = (email) => {
        return email ? email.charAt(0).toUpperCase() : 'U';
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);
        
        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now - date) / (1000 * 60));
            return `${diffInMinutes} minutes ago`;
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)} hours ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} days ago`;
        }
    };

    const getCryptoName = (symbol) => {
        const names = {
            bitcoin: 'Bitcoin', btc: 'Bitcoin',
            ethereum: 'Ethereum', eth: 'Ethereum',
            cardano: 'Cardano', ada: 'Cardano',
            polkadot: 'Polkadot', dot: 'Polkadot',
            binancecoin: 'BNB', bnb: 'BNB',
            solana: 'Solana', sol: 'Solana'
        };
        return names[symbol.toLowerCase()] || symbol.toUpperCase();
    };

    const getCryptoPrice = (symbol) => {
        return cryptoPrices[symbol] || getLatestCryptoPrice(symbol);
    };

    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                <div className="dashboard-content">
                    {/* Header */}
                    <div className="dashboard-header">
                        <h1 className="dashboard-title">Dashboard</h1>
                        <p className="dashboard-subtitle">Welcome back, {user?.email?.split('@')[0] || 'Trader'}</p>
                    </div>

                    {/* User Profile & Portfolio Overview */}
                    <div className="dashboard-grid">
                        {/* User Profile Card */}
                        <div className="dashboard-card profile-card">
                            <div className="card-header">
                                <h2 className="card-title">Profile</h2>
                                <User className="card-icon" />
                            </div>
                            
                            <div className="profile-avatar">
                                {getUserInitials(user?.email)}
                            </div>
                            
                            <h3 className="profile-name">{user?.email?.split('@')[0] || 'Trader'}</h3>
                            <p className="profile-email">{user?.email}</p>
                            
                            <div className="profile-stats">
                                <div className="stat-item">
                                    <span className="stat-value">{formatCurrency(balance)}</span>
                                    <span className="stat-label">Available Balance</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{cryptosList.length}</span>
                                    <span className="stat-label">Assets</span>
                                </div>
                            </div>
                        </div>

                        {/* Portfolio Overview */}
                        <div className="dashboard-card">
                            <div className="card-header">
                                <h2 className="card-title">Portfolio Value</h2>
                                <Wallet className="card-icon" />
                            </div>
                            
                            <div className="portfolio-header">
                                <div className="portfolio-total">
                                    {formatCurrency(portfolioTotal)}
                                </div>
                                <div className={`portfolio-change ${portfolioChange.value >= 0 ? 'positive' : 'negative'}`}>
                                    {portfolioChange.value >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                    <span>
                                        {portfolioChange.value >= 0 ? '+' : ''}
                                        {formatCurrency(portfolioChange.value)} ({portfolioChange.percentage}%)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Crypto Holdings */}
                    <div className="dashboard-grid-full">
                        <div className="dashboard-card">
                            <div className="card-header">
                                <h2 className="card-title">Crypto Holdings</h2>
                                <BarChart3 className="card-icon" />
                            </div>
                            
                            {cryptosList.length > 0 ? (
                                <div className="crypto-list">
                                    {cryptosList.map(([crypto, amount]) => {
                                        const price = getCryptoPrice(crypto);
                                        const value = price * amount;
                                        
                                        return (
                                            <div key={crypto} className="crypto-item">
                                                <div className="crypto-info">
                                                    <div className="crypto-icon">
                                                        {crypto.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="crypto-details">
                                                        <h4>{getCryptoName(crypto)}</h4>
                                                        <p>{crypto.toUpperCase()}</p>
                                                    </div>
                                                </div>
                                                <div className="crypto-value">
                                                    <p className="crypto-amount">{amount.toLocaleString()} {crypto.toUpperCase()}</p>
                                                    <p className="crypto-usd">{formatCurrency(value)}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <BarChart3 className="empty-state-icon" />
                                    <p>No cryptocurrencies in your portfolio yet</p>
                                    <p>Start trading to build your portfolio!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="dashboard-grid-full">
                        <div className="dashboard-card">
                            <div className="card-header">
                                <h2 className="card-title">Recent Activity</h2>
                                <Activity className="card-icon" />
                            </div>
                            
                            {recentTransactions.length > 0 ? (
                                <div className="transaction-list">
                                    {recentTransactions.map((transaction) => (
                                        <div key={transaction.id} className="transaction-item">
                                            <div className="transaction-info">
                                                <div className={`transaction-icon ${transaction.type}`}>
                                                    {transaction.type === 'buy' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                                                </div>
                                                <div className="transaction-details">
                                                    <h4>
                                                        {transaction.type === 'buy' ? 'Bought' : 'Sold'} {transaction.crypto}
                                                    </h4>
                                                    <p>{formatDate(transaction.timestamp)}</p>
                                                </div>
                                            </div>
                                            <div className="transaction-amount">
                                                <p className={transaction.type === 'buy' ? 'negative' : 'positive'}>
                                                    {transaction.type === 'buy' ? '-' : '+'}
                                                    {formatCurrency(transaction.total)}
                                                </p>
                                                <p>{transaction.amount} {transaction.crypto}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <Activity className="empty-state-icon" />
                                    <p>No transactions yet</p>
                                    <p>Start trading to see your transaction history here!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="dashboard-actions">
                        <button 
                            className="action-btn primary"
                            onClick={() => window.location.href = '/exchange'}
                        >
                            <TrendingUp size={20} />
                            Start Trading
                        </button>
                        
                        <button 
                            className="action-btn secondary"
                            onClick={() => window.location.href = '/exchange'}
                        >
                            <BarChart3 size={20} />
                            View Charts
                        </button>
                        
                        <button 
                            className="action-btn danger"
                            onClick={logout}
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserDashboard;