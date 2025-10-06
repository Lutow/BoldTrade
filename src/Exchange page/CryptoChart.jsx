import React, { useEffect, useState } from 'react';
import { 
  ComposedChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine 
} from 'recharts';
import './CryptoChart.css';

// Mapping des IDs CoinRanking 
const COIN_RANKING_IDS = {
  'bitcoin': 'Qwsogvtv82FCd',
  'ethereum': 'razxDUgYGNAdQ',
  'binancecoin': 'WcwrkfNI4FUAe',
  'cardano': 'qzawljRxB5bYu',
  'solana': 'zNZHO_Sjf',
  'avalanche-2': 'dvUj0CzDZ'
};

const CryptoChart = ({ selectedCrypto }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Crypto par défaut si aucune n'est sélectionnée
  const cryptoId = selectedCrypto?.id || 'bitcoin';
  const cryptoName = selectedCrypto?.name || 'Bitcoin';
  const cryptoSymbol = selectedCrypto?.symbol || 'BTC';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Récupération de la clé API depuis les variables d'environnement
        const API_KEY = import.meta.env.VITE_COIN_RANKING_API_KEY;
        const coinId = COIN_RANKING_IDS[cryptoId];
        
        if (!API_KEY) {
          throw new Error('Clé API CoinRanking manquante. Vérifiez votre fichier .env');
        }
        
        if (!coinId) {
          throw new Error(`Données de prix non disponibles pour ${cryptoName} (${cryptoSymbol}). Cette cryptomonnaie n'est pas encore supportée dans notre base de données.`);
        }
        
        // URL CoinRanking pour l'historique des prix (30 jours)
        const response = await fetch(
          `https://api.coinranking.com/v2/coin/${coinId}/history?timePeriod=30d`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-RapidAPI-Key': API_KEY,
              'X-RapidAPI-Host': 'api.coinranking.com'
            }
          }
        );
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Cryptomonnaie non trouvée sur CoinRanking pour ${cryptoName} (${cryptoSymbol})`);
          } else if (response.status === 429) {
            throw new Error(`Limite de requêtes atteinte. Veuillez attendre quelques minutes avant de réessayer.`);
          } else if (response.status === 401) {
            throw new Error(`Clé API invalide ou expirée. Vérifiez votre configuration.`);
          } else {
            throw new Error(`Erreur API CoinRanking: ${response.status} - ${response.statusText}`);
          }
        }
        
        const result = await response.json();
        
        if (!result.data || !result.data.history) {
          throw new Error('Données non disponibles pour cette crypto');
        }
        
        // Transformation des données CoinRanking pour recharts
        const formattedData = result.data.history
          .reverse() // CoinRanking renvoie les données dans l'ordre inverse
          .map((item) => {
            const date = new Date(item.timestamp * 1000); // CoinRanking utilise timestamp en secondes
            return {
              date: date.toLocaleDateString('fr-FR', { 
                month: 'short', 
                day: 'numeric' 
              }),
              price: Math.round(parseFloat(item.price)),
              timestamp: item.timestamp
            };
          });

        setData(formattedData);
        setIsLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cryptoId, cryptoName, cryptoSymbol]);

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="crypto-chart-tooltip">
          <p>{label}</p>
          <p className="price">
            Prix: ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  if (error) {
    return (
      <div className="crypto-chart-state">
        <div className="crypto-chart-error-content">
          <p>❌ Erreur de chargement</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="crypto-chart-state crypto-chart-loading">
        <div className="crypto-chart-loading-content">
          <p>Loading of {cryptoName}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="crypto-chart-container">
      <div className="crypto-chart-title">
        {cryptoName} ({cryptoSymbol}) - Price over 30 days
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#666"
            fontSize={12}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#26a69a" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: '#26a69a' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CryptoChart;