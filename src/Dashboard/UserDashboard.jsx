import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { usePortfolio } from '../hooks/useAuth.js';
import Navbar from '../Navbar/Navbar.jsx';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const { balance, cryptos } = usePortfolio();

    const cryptosList = Object.entries(cryptos);

    return (
        <>
            <Navbar />
            <div style={{ 
                padding: '2rem', 
                maxWidth: '800px', 
                margin: '0 auto',
                color: '#fff',
                backgroundColor: '#1a1a1a',
                minHeight: '100vh'
            }}>
                <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    Dashboard
                </h1>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '2rem',
                    marginBottom: '2rem'
                }}>
                    {/* Informations utilisateur */}
                    <div style={{ 
                        padding: '1.5rem', 
                        backgroundColor: '#2a2a2a', 
                        borderRadius: '10px',
                        border: '1px solid #665DCD'
                    }}>
                        <h2 style={{ marginBottom: '1rem', color: '#665DCD' }}>
                            Account Information
                        </h2>
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>ID:</strong> {user?.id}</p>
                        <p><strong>Balance:</strong> ${balance.toLocaleString()}</p>
                    </div>

                    {/* Portfolio */}
                    <div style={{ 
                        padding: '1.5rem', 
                        backgroundColor: '#2a2a2a', 
                        borderRadius: '10px',
                        border: '1px solid #665DCD'
                    }}>
                        <h2 style={{ marginBottom: '1rem', color: '#665DCD' }}>
                            Crypto Portfolio
                        </h2>
                        {cryptosList.length > 0 ? (
                            cryptosList.map(([crypto, amount]) => (
                                <p key={crypto}>
                                    <strong>{crypto.toUpperCase()}:</strong> {amount}
                                </p>
                            ))
                        ) : (
                            <p style={{ fontStyle: 'italic', color: '#888' }}>
                                No cryptocurrencies in portfolio
                            </p>
                        )}
                    </div>
                </div>


                {/* Actions */}
                <div style={{ textAlign: 'center', gap: '1rem', display: 'flex', justifyContent: 'center' }}>
                    <button 
                        onClick={() => window.location.href = '/exchange'}
                        style={{
                            backgroundColor: '#665DCD',
                            color: '#fff',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Go to Trading
                    </button>
                    
                    <button 
                        onClick={logout}
                        style={{
                            backgroundColor: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
};

export default UserDashboard;