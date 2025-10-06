import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { usePortfolio } from '../hooks/useAuth.js';
import './TradingActions.css';

const TradingActions = ({ selectedCrypto }) => {
  const [activeAction, setActiveAction] = useState('buy');
  const [amount, setAmount] = useState('');
  const [totalUSD, setTotalUSD] = useState('');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [isUpdatingAmount, setIsUpdatingAmount] = useState(false);
  const [isUpdatingTotal, setIsUpdatingTotal] = useState(false);
  const [tradeError, setTradeError] = useState('');
  const [tradeSuccess, setTradeSuccess] = useState('');
  const [exchangeTargetCrypto, setExchangeTargetCrypto] = useState('');
  const [targetCryptoPrice, setTargetCryptoPrice] = useState(0);
  
  const { user } = useAuth();
  const { balance, cryptos, addTransaction } = usePortfolio();

  // Liste des cryptos disponibles pour l'échange
  const availableCryptos = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
    { id: 'solana', name: 'Solana', symbol: 'SOL' },
  ];

  // Fonction pour obtenir le symbole de la crypto cible
  const getTargetCryptoSymbol = () => {
    const targetCrypto = availableCryptos.find(crypto => crypto.id === exchangeTargetCrypto);
    return targetCrypto ? targetCrypto.symbol : '';
  };

  const cryptoName = selectedCrypto?.name || 'Bitcoin';
  const cryptoSymbol = selectedCrypto?.symbol || 'BTC';
  const cryptoLogo = selectedCrypto?.logo || '₿';
  const cryptoId = selectedCrypto?.id || 'bitcoin';

  const [isResetting, setIsResetting] = useState(false);
  const [previousCryptoId, setPreviousCryptoId] = useState(cryptoId);

  // Réinitialisation smooth des montants quand la crypto change
  useEffect(() => {
    if (cryptoId !== previousCryptoId) {
      const hasValues = amount || totalUSD;
      
      if (hasValues) { // Seulement si il y a des valeurs à reset
        setIsResetting(true);
        
        // Fade out avec delay
        setTimeout(() => {
          setAmount('');
          setTotalUSD('');
          setCurrentPrice(0);
          
          // Fade in après reset
          setTimeout(() => {
            setIsResetting(false);
          }, 150);
        }, 200);
      } else {
        setCurrentPrice(0);
      }
      
      setPreviousCryptoId(cryptoId);
    }
  }, [cryptoId, previousCryptoId, amount, totalUSD]);

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
        };
        
        const coinId = coinRankingIds[cryptoId];
        
        if (!coinId) {
          console.error('ID CoinRanking non trouvé pour:', cryptoId);
          setCurrentPrice(0);
          return;
        }
        
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

  // Récupération du prix de la crypto cible pour l'échange
  useEffect(() => {
    const fetchTargetCryptoPrice = async () => {
      if (!exchangeTargetCrypto) {
        setTargetCryptoPrice(0);
        return;
      }

      try {
        const API_KEY = import.meta.env.VITE_COIN_RANKING_API_KEY;
        const coinRankingIds = {
          'bitcoin': 'Qwsogvtv82FCd',
          'ethereum': 'razxDUgYGNAdQ',
          'binancecoin': 'WcwrkfNI4FUAe',
          'cardano': 'qzawljRxB5bYu',
          'solana': 'zNZHO_Sjf',
        };
        
        const coinId = coinRankingIds[exchangeTargetCrypto];
        
        if (!coinId) {
          console.error('Target crypto ID not found:', exchangeTargetCrypto);
          setTargetCryptoPrice(0);
          return;
        }
        
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
            setTargetCryptoPrice(parseFloat(result.data.coin.price));
          }
        }
      } catch (error) {
        console.error('Error fetching target crypto price:', error);
        setTargetCryptoPrice(0);
      }
    };

    fetchTargetCryptoPrice();
  }, [exchangeTargetCrypto]);

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
    setTradeError('');
    setTradeSuccess('');
    
    const cryptoAmount = parseFloat(amount);
    const usdAmount = parseFloat(totalUSD);
    
    if (!cryptoAmount || !usdAmount || !currentPrice) {
      setTradeError('Please enter a valid amount');
      return;
    }
    
    if (activeAction === 'buy') {
      // Vérifier si l'utilisateur a assez de fonds
      if (balance < usdAmount) {
        setTradeError(`Insufficient funds. Available balance: $${balance.toLocaleString()}`);
        return;
      }
      
      // Effectuer l'achat
      const result = addTransaction(cryptoId, cryptoAmount, currentPrice, 'buy');
      if (result.success) {
        setTradeSuccess(`Purchase successful! ${cryptoAmount} ${cryptoSymbol} bought for $${usdAmount}`);
        setAmount('');
        setTotalUSD('');
      } else {
        setTradeError(result.error);
      }
    } else if (activeAction === 'sell') {
      // Vérifier si l'utilisateur a assez de crypto
      const ownedAmount = cryptos[cryptoId] || 0;
      if (ownedAmount < cryptoAmount) {
        setTradeError(`Insufficient ${cryptoSymbol}. Available quantity: ${ownedAmount}`);
        return;
      }
      
      // Effectuer la vente
      const result = addTransaction(cryptoId, cryptoAmount, currentPrice, 'sell');
      if (result.success) {
        setTradeSuccess(`Sale successful! ${cryptoAmount} ${cryptoSymbol} sold for $${usdAmount}`);
        setAmount('');
        setTotalUSD('');
      } else {
        setTradeError(result.error);
      }
    } else if (activeAction === 'exchange') {
      // Vérifier si une crypto cible est sélectionnée
      if (!exchangeTargetCrypto) {
        setTradeError('Please select a cryptocurrency to exchange to');
        return;
      }
      
      if (!targetCryptoPrice) {
        setTradeError('Unable to get target cryptocurrency price');
        return;
      }
      
      // Vérifier si l'utilisateur a assez de crypto à échanger
      const ownedAmount = cryptos[cryptoId] || 0;
      if (ownedAmount < cryptoAmount) {
        setTradeError(`Insufficient ${cryptoSymbol}. Available quantity: ${ownedAmount}`);
        return;
      }
      
      // Calculer le montant de crypto cible à recevoir
      const usdValue = cryptoAmount * currentPrice;
      const targetCryptoAmount = usdValue / targetCryptoPrice;
      
      // Effectuer l'échange (vendre la crypto source et acheter la crypto cible)
      const sellResult = addTransaction(cryptoId, cryptoAmount, currentPrice, 'sell');
      if (sellResult.success) {
        const buyResult = addTransaction(exchangeTargetCrypto, targetCryptoAmount, targetCryptoPrice, 'buy');
        if (buyResult.success) {
          setTradeSuccess(`Exchange successful! ${cryptoAmount} ${cryptoSymbol} exchanged for ${targetCryptoAmount.toFixed(6)} ${getTargetCryptoSymbol()}`);
          setAmount('');
          setTotalUSD('');
          setExchangeTargetCrypto('');
        } else {
          // Si l'achat échoue, on doit rembourser la vente
          addTransaction(cryptoId, cryptoAmount, currentPrice, 'buy');
          setTradeError('Exchange failed: ' + buyResult.error);
        }
      } else {
        setTradeError(sellResult.error);
      }
    }
    
    // Clear messages after 5 seconds
    setTimeout(() => {
      setTradeError('');
      setTradeSuccess('');
    }, 5000);
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'buy': return '#26a69a';
      case 'sell': return '#ef5350';
      case 'exchange': return '#665DCD';
      default: return '#26a69a';
    }
  };



  return (
    <div className="trading-actions">
      <div 
        className="trading-header"
        style={{
          opacity: isResetting ? 0.6 : 1,
          transform: isResetting ? 'scale(0.98)' : 'scale(1)',
          transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out'
        }}
      >
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
          Buy
        </button>
        <button
          className={`action-btn ${activeAction === 'sell' ? 'active' : ''}`}
          onClick={() => handleActionChange('sell')}
          style={{ 
            backgroundColor: activeAction === 'sell' ? '#ef5350' : 'transparent',
            borderColor: '#ef5350'
          }}
        >
          Sell
        </button>
        <button
          className={`action-btn ${activeAction === 'exchange' ? 'active' : ''}`}
          onClick={() => handleActionChange('exchange')}
          style={{ 
            backgroundColor: activeAction === 'exchange' ? '#665DCD' : 'transparent',
            borderColor: '#665DCD'
          }}
        >
          Exchange
        </button>
      </div>

      {/* Formulaire de trading */}
      <div className="trading-form">
        <div className="form-group">
          <label className="form-label">
            Amount ({cryptoSymbol})
          </label>
          <input
            type="number"
            className={`form-input ${isResetting ? 'resetting' : ''}`}
            placeholder={`0.00 ${cryptoSymbol}`}
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            step="0.1"
            min="0"
            style={{
              opacity: isResetting ? 0.3 : 1,
              transition: 'opacity 0.3s ease-in-out'
            }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Total (USD)
          </label>
          <input
            type="number"
            className={`form-input ${isResetting ? 'resetting' : ''}`}
            placeholder="0.00 USD"
            value={totalUSD}
            onChange={(e) => handleTotalUSDChange(e.target.value)}
            step="0.01"
            min="0"
            style={{
              opacity: isResetting ? 0.3 : 1,
              transition: 'opacity 0.3s ease-in-out'
            }}
          />
        </div>
        
        {currentPrice > 0 && (
          <div 
            className="price-info"
            style={{
              opacity: isResetting ? 0.3 : 1,
              transition: 'opacity 0.3s ease-in-out'
            }}
          >
            <span className="current-price">
              Current price: ${currentPrice.toLocaleString()}
            </span>
          </div>
        )}

        <button
          className="trade-button"
          onClick={handleTrade}
          disabled={!amount || !totalUSD || isResetting}
          style={{ 
            backgroundColor: getActionColor(activeAction),
            opacity: isResetting ? 0.5 : 1,
            transition: 'opacity 0.3s ease-in-out, background-color 0.3s ease'
          }}
        >
          {activeAction === 'buy' && `Buy ${amount || '0'} ${cryptoSymbol} for $${totalUSD || '0'}`}
          {activeAction === 'sell' && `Sell ${amount || '0'} ${cryptoSymbol} for $${totalUSD || '0'}`}
          {activeAction === 'exchange' && `Exchange ${amount || '0'} ${cryptoSymbol}`}
        </button>
      </div>

      {/* Error and success messages */}
      {tradeError && (
        <div className="trade-message error-message" style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#ef4444',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '14px'
        }}>
          {tradeError}
        </div>
      )}
      
      {tradeSuccess && (
        <div className="trade-message success-message" style={{
          background: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          color: '#22c55e',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '14px'
        }}>
          {tradeSuccess}
        </div>
      )}

      {/* Additional information */}
      <div className="trading-info">
        <div className="info-row">
          <span className="info-label">Balance USD:</span>
          <span className="info-value">${balance.toLocaleString()}</span>
        </div>
        <div className="info-row">
          <span className="info-label">{cryptoSymbol} held:</span>
          <span className="info-value">{(cryptos[cryptoId] || 0).toFixed(8)}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Fees:</span>
          <span className="info-value">0.1%</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="quick-actions">
        <h4 className="quick-title">Quick actions</h4>
        <div className="quick-buttons">
          {activeAction === 'buy' && currentPrice > 0 && (
            <>
              <button 
                className="quick-btn"
                onClick={() => handleTotalUSDChange('100')}
                disabled={balance < 100}
              >
                $100
              </button>
              <button 
                className="quick-btn"
                onClick={() => handleTotalUSDChange('500')}
                disabled={balance < 500}
              >
                $500
              </button>
              <button 
                className="quick-btn"
                onClick={() => handleTotalUSDChange('1000')}
                disabled={balance < 1000}
              >
                $1000
              </button>
              <button 
                className="quick-btn"
                onClick={() => handleTotalUSDChange(Math.min(balance, 5000).toString())}
                disabled={balance < 100}
              >
                25% Balance
              </button>
              <button 
                className="quick-btn"
                onClick={() => handleTotalUSDChange(Math.min(balance, 10000).toString())}
                disabled={balance < 100}
              >
                Max
              </button>
            </>
          )}
          
          {activeAction === 'sell' && (
            <>
              <button 
                className="quick-btn"
                onClick={() => handleAmountChange('1')}
                disabled={(cryptos[cryptoId] || 0) < 1}
              >
                1 {cryptoSymbol}
              </button>
              <button 
                className="quick-btn"
                onClick={() => handleAmountChange('0.1')}
                disabled={(cryptos[cryptoId] || 0) < 0.1}
              >
                0.1 {cryptoSymbol}
              </button>
              <button 
                className="quick-btn"
                onClick={() => handleAmountChange('0.01')}
                disabled={(cryptos[cryptoId] || 0) < 0.01}
              >
                0.01 {cryptoSymbol}
              </button>
              <button 
                className="quick-btn"
                onClick={() => handleAmountChange(((cryptos[cryptoId] || 0) * 0.5).toFixed(8))}
                disabled={(cryptos[cryptoId] || 0) === 0}
              >
                50%
              </button>
              <button 
                className="quick-btn"
                onClick={() => handleAmountChange((cryptos[cryptoId] || 0).toString())}
                disabled={(cryptos[cryptoId] || 0) === 0}
              >
                Max
              </button>
            </>
          )}
          
          {activeAction === 'exchange' && (
            <div className="exchange-section">
              <div className="exchange-selector-container">
                <label className="exchange-label">Exchange to:</label>
                <select 
                  className="crypto-select"
                  value={exchangeTargetCrypto}
                  onChange={(e) => setExchangeTargetCrypto(e.target.value)}
                >
                  <option value="">Select crypto to exchange to</option>
                  {availableCryptos.filter(crypto => crypto.id !== cryptoId).map(crypto => (
                    <option key={crypto.id} value={crypto.id}>
                      {crypto.name} ({crypto.symbol})
                    </option>
                  ))}
                </select>
              </div>
              
              {exchangeTargetCrypto && targetCryptoPrice > 0 && (
                <div className="exchange-info">
                  <div className="exchange-rate">
                    <span>Exchange Rate:</span>
                    <span>1 {cryptoSymbol} = {(currentPrice / targetCryptoPrice).toFixed(6)} {getTargetCryptoSymbol()}</span>
                  </div>
                  <div className="exchange-preview">
                    <span>You will receive approximately:</span>
                    <span className="receive-amount">
                      {amount ? ((parseFloat(amount) * currentPrice) / targetCryptoPrice).toFixed(6) : '0'} {getTargetCryptoSymbol()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingActions;