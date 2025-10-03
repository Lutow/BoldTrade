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

// Mapping des IDs CoinGecko vers CoinRanking
const COIN_RANKING_IDS = {
  'bitcoin': 'Qwsogvtv82FCd',
  'ethereum': 'razxDUgYGNAdQ',
  'binancecoin': 'WcwrkfNI4FUAe',
  'cardano': 'qzawljRxB5bYu',
  'solana': 'zNZHO_Sjf',
  'polkadot': 'MKhxjUCOp',
  'chainlink': 'ZlZpBOB4-',
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
        const coinId = COIN_RANKING_IDS[cryptoId] || 'Qwsogvtv82FCd'; // Bitcoin par défaut
        
        if (!API_KEY) {
          throw new Error('Clé API CoinRanking manquante. Vérifiez votre fichier .env');
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
          throw new Error(`Erreur API CoinRanking: ${response.status}`);
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
  }, [cryptoId]);

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '8px',
          border: 'none'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          <p style={{ margin: '5px 0 0 0', color: '#26a69a' }}>
            Prix: ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  if (error) {
    return (
      <div style={{ 
        height: '400px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <p>❌ Erreur de chargement</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{
        color: '#666', 
        height: '400px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p>Loading of {cryptoName}...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100%', 
      height: '400px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: 'white',
      padding: '20px'
    }}>
      <div style={{ marginBottom: '10px', color: '#333', fontWeight: 'bold' }}>
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