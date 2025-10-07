import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import Navbar from '../Navbar/Navbar.jsx';
import './AddFunds.css';
import Footer from '../Footer/Footer.jsx';

const AddFunds = () => {
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [customAmount, setCustomAmount] = useState('');
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvc: '',
        cardHolder: '',
        billingAddress: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState('');

    const { user, updatePortfolio } = useAuth();
    const navigate = useNavigate();

    const predefinedAmounts = [100, 500, 1000, 2500, 5000, 10000];

    const handleAmountSelect = (amount) => {
        setSelectedAmount(amount);
        setCustomAmount('');
        setErrors('');
    };

    const handleCustomAmountChange = (e) => {
        const value = e.target.value;
        if (value === '' || (!isNaN(value) && parseFloat(value) > 0)) {
            setCustomAmount(value);
            setSelectedAmount(null);
            setErrors('');
        }
    };

    const getSelectedAmount = () => {
        return selectedAmount || parseFloat(customAmount) || 0;
    };

    const handlePaymentDataChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Formatage automatique pour les champs spéciaux
        if (name === 'cardNumber') {
            formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
        } else if (name === 'expiryDate') {
            formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/').slice(0, 5);
        } else if (name === 'cvc') {
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
        }

        setPaymentData(prev => ({
            ...prev,
            [name]: formattedValue
        }));
    };

    const handleContinueToPayment = () => {
        const amount = getSelectedAmount();
        if (amount <= 0) {
            setErrors('Please select a valid amount');
            return;
        }
        if (amount > 50000) {
            setErrors('Maximum amount is $50,000');
            return;
        }
        setShowPaymentForm(true);
    };

    const validatePaymentForm = () => {
        if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, '').length < 13) {
            return 'Invalid card number';
        }
        if (!paymentData.expiryDate || paymentData.expiryDate.length < 5) {
            return 'Invalid expiry date';
        }
        if (!paymentData.cvc || paymentData.cvc.length < 3) {
            return 'Invalid CVC';
        }
        if (!paymentData.cardHolder.trim()) {
            return 'Cardholder name required';
        }
        return null;
    };

    const handlePayment = async () => {
        const validationError = validatePaymentForm();
        if (validationError) {
            setErrors(validationError);
            return;
        }

        setIsProcessing(true);
        setErrors('');

        try {
            // Simulation du traitement du paiement (2 secondes)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Ajouter les fonds au portfolio de l'utilisateur
            const amount = getSelectedAmount();
            const newPortfolio = {
                ...user.portfolio,
                balance: user.portfolio.balance + amount
            };

            updatePortfolio(newPortfolio);

            // Show success message and redirect
            alert(`Payment successful! $${amount} has been added to your account.`);
            navigate('/dashboard');

        } catch {
            setErrors('Error processing payment. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="add-funds-container">
                <div className="add-funds-card">
                    <div className="add-funds-header">
                        <h1>Add Funds</h1>
                        <p>Top up your BoldTrade account</p>
                    </div>

                    {!showPaymentForm ? (
                        <>
                            {/* Sélection du montant */}
                            <div className="amount-selection">
                                <h2>Choose an amount</h2>
                                
                                <div className="predefined-amounts">
                                    {predefinedAmounts.map(amount => (
                                        <button
                                            key={amount}
                                            className={`amount-btn ${selectedAmount === amount ? 'selected' : ''}`}
                                            onClick={() => handleAmountSelect(amount)}
                                        >
                                            ${amount.toLocaleString()}
                                        </button>
                                    ))}
                                </div>

                                <div className="custom-amount">
                                    <label>Or enter a custom amount:</label>
                                    <div className="custom-input-container">
                                        <span className="currency-symbol">$</span>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={customAmount}
                                            onChange={handleCustomAmountChange}
                                            className="custom-amount-input"
                                        />
                                    </div>
                                </div>

                                {errors && (
                                    <div className="error-message">{errors}</div>
                                )}

                                <div className="amount-summary">
                                    <div className="summary-row">
                                        <span>Selected amount:</span>
                                        <span className="amount-value">${getSelectedAmount().toLocaleString()}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Transaction fees:</span>
                                        <span className="fee-value">Free</span>
                                    </div>
                                    <div className="summary-row total">
                                        <span>Total to pay:</span>
                                        <span className="total-value">${getSelectedAmount().toLocaleString()}</span>
                                    </div>
                                </div>

                                <button 
                                    className="continue-btn"
                                    onClick={handleContinueToPayment}
                                    disabled={getSelectedAmount() <= 0}
                                >
                                    Continue to Payment
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Formulaire de paiement */}
                            <div className="payment-form">
                                <div className="payment-header">
                                    <button 
                                        className="back-btn"
                                        onClick={() => setShowPaymentForm(false)}
                                    >
                                        ← Back
                                    </button>
                                    <h2>Payment Information</h2>
                                    <div className="amount-display">
                                        Total: ${getSelectedAmount().toLocaleString()}
                                    </div>
                                </div>

                                <form className="payment-fields">
                                    <div className="field-group">
                                        <label>Card Number</label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            placeholder="1234 5678 9012 3456"
                                            value={paymentData.cardNumber}
                                            onChange={handlePaymentDataChange}
                                            className="payment-input"
                                        />
                                    </div>

                                    <div className="field-row">
                                        <div className="field-group">
                                            <label>Expiry Date</label>
                                            <input
                                                type="text"
                                                name="expiryDate"
                                                placeholder="MM/YY"
                                                value={paymentData.expiryDate}
                                                onChange={handlePaymentDataChange}
                                                className="payment-input"
                                            />
                                        </div>
                                        <div className="field-group">
                                            <label>CVC</label>
                                            <input
                                                type="text"
                                                name="cvc"
                                                placeholder="123"
                                                value={paymentData.cvc}
                                                onChange={handlePaymentDataChange}
                                                className="payment-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="field-group">
                                        <label>Cardholder Name</label>
                                        <input
                                            type="text"
                                            name="cardHolder"
                                            placeholder="John Doe"
                                            value={paymentData.cardHolder}
                                            onChange={handlePaymentDataChange}
                                            className="payment-input"
                                        />
                                    </div>

                                    <div className="field-group">
                                        <label>Billing Address</label>
                                        <input
                                            type="text"
                                            name="billingAddress"
                                            placeholder="123 Main St, New York, NY 10001"
                                            value={paymentData.billingAddress}
                                            onChange={handlePaymentDataChange}
                                            className="payment-input"
                                        />
                                    </div>

                                    {errors && (
                                        <div className="error-message">{errors}</div>
                                    )}

                                    <button 
                                        type="button"
                                        className="payment-btn"
                                        onClick={handlePayment}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? 'Processing...' : `Pay $${getSelectedAmount().toLocaleString()}`}
                                    </button>
                                </form>

                                <div className="security-info">
                                    <p>🔒 Secure Payment - All transactions are encrypted</p>
                                    <p style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
                                        Note : This is a student project. No real payment will be processed and the card information is not stored in any way.
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                
            </div>
            <Footer />
        </>
    );
};

export default AddFunds;