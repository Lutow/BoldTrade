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
    const { user, setUser } = useAuth();
    
    const addTransaction = (crypto, amount, price, type) => {
        if (!user) return { success: false, error: 'Utilisateur non connecté' };
        
        const newPortfolio = { ...user.portfolio };
        const totalValue = amount * price;
        
        if (type === 'buy') {
            if (newPortfolio.balance < totalValue) {
                return { success: false, error: 'Solde insuffisant' };
            }
            
            newPortfolio.balance -= totalValue;
            newPortfolio.cryptos[crypto] = (newPortfolio.cryptos[crypto] || 0) + amount;
        } else if (type === 'sell') {
            const currentAmount = newPortfolio.cryptos[crypto] || 0;
            if (currentAmount < amount) {
                return { success: false, error: 'Quantité insuffisante' };
            }
            
            newPortfolio.balance += totalValue;
            newPortfolio.cryptos[crypto] = currentAmount - amount;
            
            // Supprimer la crypto si la quantité est 0
            if (newPortfolio.cryptos[crypto] <= 0) {
                delete newPortfolio.cryptos[crypto];
            }
        }
        
        // Créer la nouvelle transaction
        const newTransaction = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            type: type,
            crypto: crypto.toUpperCase(),
            amount: amount,
            price: price,
            total: totalValue,
            status: 'completed',
            timestamp: new Date().toISOString(),
            userId: user.id
        };

        // Créer l'utilisateur complètement mis à jour en UNE SEULE opération
        const updatedTransactions = [newTransaction, ...(user.transactions || [])];
        const updatedUser = {
            ...user,
            portfolio: newPortfolio,
            transactions: updatedTransactions
        };
        
        console.log('🔄 Mise à jour complète de l\'utilisateur:', updatedUser);
        
        try {
            // Mettre à jour l'état React
            setUser(updatedUser);
            
            // Mettre à jour localStorage session
            localStorage.setItem('boldtrade_user', JSON.stringify(updatedUser));
            
            // Mettre à jour la base de données des utilisateurs
            const existingUsers = JSON.parse(localStorage.getItem('boldtrade_users') || '[]');
            const updatedUsers = existingUsers.map(u => 
                u.id === user.id ? { 
                    ...u, 
                    portfolio: newPortfolio,
                    transactions: updatedTransactions,
                    password: u.password // Conserver le mot de passe
                } : u
            );
            localStorage.setItem('boldtrade_users', JSON.stringify(updatedUsers));
            
            console.log('✅ Transaction sauvegardée avec succès');
            console.log('💰 Nouvelle balance:', newPortfolio.balance);
            
            return { success: true };
        } catch (error) {
            console.error('❌ Erreur lors de la transaction:', error);
            return { success: false, error: 'Erreur lors de la sauvegarde' };
        }
    };
    
    return {
        portfolio: user?.portfolio,
        balance: user?.portfolio?.balance || 0,
        cryptos: user?.portfolio?.cryptos || {},
        transactions: user?.transactions || [],
        addTransaction
    };
};