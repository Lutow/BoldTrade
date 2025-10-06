import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import CryptoChart from "./CryptoChart";
import CryptoSelector from "./CryptoSelector";
import TradingActions from "./TradingActions";
import "./Exchange.css";

const Exchange = () => {
  const [selectedCrypto, setSelectedCrypto] = useState(null);

  const handleCryptoChange = (crypto) => {
    setSelectedCrypto(crypto);
    console.log('Crypto sélectionnée:', crypto);
  };

  return (
    <div>
      <Navbar />
      <div className="exchange-container">
        <div className="exchange-layout">
          <div className="crypto-selector-section">
            <CryptoSelector onCryptoChange={handleCryptoChange} />
          </div>
          <div className="crypto-chart-section">
            <CryptoChart selectedCrypto={selectedCrypto} />
          </div>
          <div className="trading-actions-section">
            <TradingActions selectedCrypto={selectedCrypto} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exchange;
