import React, { useState, useEffect } from 'react';
import './TradingActions.css';

const TradingActions = ({ selectedCrypto }) => {
  const [activeAction, setActiveAction] = useState('buy');
  const [amount, setAmount] = useState('');
  const [totalUSD, setTotalUSD] = useState('');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [isUpdatingAmount, setIsUpdatingAmount] = useState(false);
  const [isUpdatingTotal, setIsUpdatingTotal] = useState(false);

  const cryptoName = selectedCrypto?.name || 'Bitcoin';
  const cryptoSymbol = selectedCrypto?.symbol || 'BTC';
  const cryptoLogo = selectedCrypto?.logo || '₿';
  const cryptoId = selectedCrypto?.id || 'bitcoin';

  // Récupération du prix actuel de la crypto
  useEffect(() => {
    const fetchCurrentPrice = async () => {
      try {
        const API_KEY = import.meta.env.VITE_COIN_RANKING_API_KEY;
        const coinRankingIds = {
          'bitcoin': 'Qwsogvtv82FCd',
          'ethereum': 'razxDUgYGNAdQ',
          'binancecoin': 'WcwrkfNI4FUAe',
          'cardano': 'qzawljRxB5bYu',
          'solana': 'zNZHO_Sjf',
          'polkadot': 'MKhxjUCOp',
          'chainlink': 'ZlZpBOB4-',
          'avalanche-2': 'dvUj0CzDZ'
        };
        
        const coinId = coinRankingIds[cryptoId] || 'Qwsogvtv82FCd';
        
        const response = await fetch(
          `https://api.coinranking.com/v2/coin/${coinId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-RapidAPI-Key': API_KEY,
              'X-RapidAPI-Host': 'api.coinranking.com'
            }
          }
        );
        
        if (response.ok) {
          const result = await response.json();
          if (result.data && result.data.coin) {
            setCurrentPrice(parseFloat(result.data.coin.price));
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du prix:', error);
        setCurrentPrice(0);
      }
    };

    fetchCurrentPrice();
  }, [cryptoId]);

  const handleActionChange = (action) => {
    setActiveAction(action);
  };

  // Gestionnaire pour le changement de montant crypto
  const handleAmountChange = (value) => {
    if (isUpdatingAmount) return;
    
    setAmount(value);
    if (value && currentPrice) {
      setIsUpdatingTotal(true);
      const usdValue = (parseFloat(value) * currentPrice).toFixed(2);
      setTotalUSD(usdValue);
      setTimeout(() => setIsUpdatingTotal(false), 100);
    } else {
      setTotalUSD('');
    }
  };

  // Gestionnaire pour le changement de montant USD
  const handleTotalUSDChange = (value) => {
    if (isUpdatingTotal) return;
    
    setTotalUSD(value);
    if (value && currentPrice) {
      setIsUpdatingAmount(true);
      const cryptoValue = (parseFloat(value) / currentPrice).toFixed(8);
      setAmount(cryptoValue);
      setTimeout(() => setIsUpdatingAmount(false), 100);
    } else {
      setAmount('');
    }
  };

  const handleTrade = () => {
    const totalValue = totalUSD || (amount && currentPrice ? (parseFloat(amount) * currentPrice).toFixed(2) : '0');
    console.log(`${activeAction} ${amount} ${cryptoSymbol} for $${totalValue}`);
    alert(`Action: ${activeAction.toUpperCase()}\nMontant: ${amount} ${cryptoSymbol}\nValeur: $${totalValue}`);
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'buy': return '#26a69a';
      case 'sell': return '#ef5350';
      case 'exchange': return '#665DCD';
      default: return '#26a69a';
    }
  };

  const getActionLabel = (action) => {
    switch (action) {
      case 'buy': return 'Acheter';
      case 'sell': return 'Vendre';
      case 'exchange': return 'Échanger';
      default: return 'Acheter';
    }
  };

  return (
    <div className="trading-actions">
      <div className="trading-header">
        <h3 className="trading-title">
          {cryptoLogo} Trading {cryptoSymbol}
        </h3>
        <p className="trading-subtitle">{cryptoName}</p>
      </div>

      {/* Boutons d'action */}
      <div className="action-buttons">
        <button
          className={`action-btn ${activeAction === 'buy' ? 'active' : ''}`}
          onClick={() => handleActionChange('buy')}
          style={{ 
            backgroundColor: activeAction === 'buy' ? '#26a69a' : 'transparent',
            borderColor: '#26a69a'
          }}
        >
          📈 Acheter
        </button>
        <button
          className={`action-btn ${activeAction === 'sell' ? 'active' : ''}`}
          onClick={() => handleActionChange('sell')}
          style={{ 
            backgroundColor: activeAction === 'sell' ? '#ef5350' : 'transparent',
            borderColor: '#ef5350'
          }}
        >
          📉 Vendre
        </button>
        <button
          className={`action-btn ${activeAction === 'exchange' ? 'active' : ''}`}
          onClick={() => handleActionChange('exchange')}
          style={{ 
            backgroundColor: activeAction === 'exchange' ? '#665DCD' : 'transparent',
            borderColor: '#665DCD'
          }}
        >
          🔄 Échanger
        </button>
      </div>

      {/* Formulaire de trading */}
      <div className="trading-form">
        <div className="form-group">
          <label className="form-label">
            Montant ({cryptoSymbol})
          </label>
          <input
            type="number"
            className="form-input"
            placeholder={`0.00 ${cryptoSymbol}`}
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            step="0.00000001"
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Total (USD)
          </label>
          <input
            type="number"
            className="form-input"
            placeholder="0.00 USD"
            value={totalUSD}
            onChange={(e) => handleTotalUSDChange(e.target.value)}
            step="0.01"
            min="0"
          />
        </div>
        
        {currentPrice > 0 && (
          <div className="price-info">
            <span className="current-price">
              Prix actuel: ${currentPrice.toLocaleString()}
            </span>
          </div>
        )}

        <button
          className="trade-button"
          onClick={handleTrade}
          disabled={!amount || !totalUSD}
          style={{ backgroundColor: getActionColor(activeAction) }}
        >
          {getActionLabel(activeAction)} {amount || '0'} {cryptoSymbol}
        </button>
      </div>

      {/* Informations supplémentaires */}
      <div className="trading-info">
        <div className="info-row">
          <span className="info-label">Disponible:</span>
          <span className="info-value">0.00 USD</span>
        </div>
        <div className="info-row">
          <span className="info-label">Frais:</span>
          <span className="info-value">0.1%</span>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="quick-actions">
        <h4 className="quick-title">Actions rapides</h4>
        <div className="quick-buttons">
          <button 
            className="quick-btn"
            onClick={() => handleAmountChange('1')}
          >
            1 {cryptoSymbol}
          </button>
          <button 
            className="quick-btn"
            onClick={() => handleAmountChange('0.1')}
          >
            0.1 {cryptoSymbol}
          </button>
          <button 
            className="quick-btn"
            onClick={() => handleAmountChange('0.01')}
          >
            0.01 {cryptoSymbol}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradingActions;