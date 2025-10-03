import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import CryptoChart from "./CryptoChart";
import CryptoSelector from "./CryptoSelector";
import TradingActions from "./TradingActions";

const Exchange = () => {
  const [selectedCrypto, setSelectedCrypto] = useState(null);

  const handleCryptoChange = (crypto) => {
    setSelectedCrypto(crypto);
    console.log('Crypto sélectionnée:', crypto);
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          alignItems: 'flex-start',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            minWidth: '280px',
            flex: '0 0 auto'
          }}>
            <CryptoSelector onCryptoChange={handleCryptoChange} />
          </div>
          <div style={{ 
            flex: '1 1 auto',
            minWidth: '600px'
          }}>
            <CryptoChart selectedCrypto={selectedCrypto} />
          </div>
          <div style={{ 
            minWidth: '320px',
            flex: '0 0 auto'
          }}>
            <TradingActions selectedCrypto={selectedCrypto} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exchange;
