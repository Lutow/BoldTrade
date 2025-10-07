import { useAuth } from '../contexts/AuthContext.jsx';

// Hook personnalisé pour utiliser l'authentification plus facilement
export const useAuthStatus = () => {
    const { user, isAuthenticated, isLoading } = useAuth();
    
    return {
        user,
        isAuthenticated,
        isLoading,
        isLoggedIn: isAuthenticated,
        userEmail: user?.email,
        userBalance: user?.portfolio?.balance,
        userId: user?.id
    };
};

// Hook pour obtenir des informations sur le portfolio
export const usePortfolio = () => {
    const { user, updatePortfolio } = useAuth();
    
    const addTransaction = (crypto, amount, price, type) => {
        if (!user) return false;
        
        const newPortfolio = { ...user.portfolio };
        
        if (type === 'buy') {
            const cost = amount * price;
            if (newPortfolio.balance < cost) {
                return { success: false, error: 'Solde insuffisant' };
            }
            
            newPortfolio.balance -= cost;
            newPortfolio.cryptos[crypto] = (newPortfolio.cryptos[crypto] || 0) + amount;
        } else if (type === 'sell') {
            const currentAmount = newPortfolio.cryptos[crypto] || 0;
            if (currentAmount < amount) {
                return { success: false, error: 'Quantité insuffisante' };
            }
            
            newPortfolio.balance += amount * price;
            newPortfolio.cryptos[crypto] = currentAmount - amount;
            
            // Supprimer la crypto si la quantité est 0
            if (newPortfolio.cryptos[crypto] === 0) {
                delete newPortfolio.cryptos[crypto];
            }
        }
        
        updatePortfolio(newPortfolio);
        return { success: true };
    };
    
    return {
        portfolio: user?.portfolio,
        balance: user?.portfolio?.balance || 0,
        cryptos: user?.portfolio?.cryptos || {},
        addTransaction
    };
};