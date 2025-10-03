import React, { useState } from 'react';
import './CryptoSelector.css';

const CryptoSelector = ({ onCryptoChange }) => {
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [isOpen, setIsOpen] = useState(false);

  const cryptos = [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      logo: '₿',
      description: 'La première et plus grande cryptomonnaie'
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      logo: '🔷',
      description: 'Plateforme de contrats intelligents'
    },
    {
      id: 'binancecoin',
      name: 'BNB',
      symbol: 'BNB',
      logo: '�',
      description: 'Token de l\'exchange Binance'
    },
    {
      id: 'cardano',
      name: 'Cardano',
      symbol: 'ADA',
      logo: '�',
      description: 'Blockchain proof-of-stake'
    },
    {
      id: 'solana',
      name: 'Solana',
      symbol: 'SOL',
      logo: '🌞',
      description: 'Blockchain haute performance'
    },
    {
      id: 'polkadot',
      name: 'Polkadot',
      symbol: 'DOT',
      logo: '⚪',
      description: 'Protocole multi-chaînes'
    },
    {
      id: 'chainlink',
      name: 'Chainlink',
      symbol: 'LINK',
      logo: '🔗',
      description: 'Réseau d\'oracles décentralisé'
    },
    {
      id: 'avalanche-2',
      name: 'Avalanche',
      symbol: 'AVAX',
      logo: '�',
      description: 'Plateforme de DApps rapide'
    }
  ];

  const handleCryptoSelect = (crypto) => {
    setSelectedCrypto(crypto.id);
    setIsOpen(false);
    if (onCryptoChange) {
      onCryptoChange(crypto);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectedCryptoData = cryptos.find(crypto => crypto.id === selectedCrypto);

  return (
    <div className="exchange-selector">
      <label className="exchange-label">
      </label>
      <div className="dropdown-container">
        <button 
          className={`dropdown-button ${isOpen ? 'open' : ''}`}
          onClick={toggleDropdown}
        >
          <div className="selected-exchange">
            <span className="exchange-logo">{selectedCryptoData.logo}</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span className="exchange-name">{selectedCryptoData.name}</span>
              <span style={{ fontSize: '12px', color: '#A0A0AB' }}>{selectedCryptoData.symbol}</span>
            </div>
          </div>
          <span className={`dropdown-arrow ${isOpen ? 'rotated' : ''}`}>
            ▼
          </span>
        </button>

        {isOpen && (
          <div className="dropdown-menu">
            {cryptos.map((crypto) => (
              <div
                key={crypto.id}
                className={`dropdown-item ${selectedCrypto === crypto.id ? 'selected' : ''}`}
                onClick={() => handleCryptoSelect(crypto)}
              >
                <div className="exchange-info">
                  <div className="exchange-header">
                    <span className="exchange-logo">{crypto.logo}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span className="exchange-name">{crypto.name}</span>
                      <span style={{ fontSize: '11px', color: '#A0A0AB', fontWeight: 'bold' }}>
                        {crypto.symbol}
                      </span>
                    </div>
                    {selectedCrypto === crypto.id && (
                      <span className="check-icon">✓</span>
                    )}
                  </div>
                  <span className="exchange-description">
                    {crypto.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Overlay pour fermer le dropdown en cliquant à l'extérieur */}
      {isOpen && (
        <div 
          className="dropdown-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default CryptoSelector;