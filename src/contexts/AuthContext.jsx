import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Charger l'utilisateur depuis localStorage au démarrage
    useEffect(() => {
        const storedUser = localStorage.getItem('boldtrade_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    // Registration function
    const register = async (email, password, confirmPassword) => {
        try {
            // Validation des champs
            if (!email || !password || !confirmPassword) {
                throw new Error('Tous les champs sont requis');
            }

            if (password !== confirmPassword) {
                throw new Error('Les mots de passe ne correspondent pas');
            }

            if (password.length < 6) {
                throw new Error('Le mot de passe doit contenir au moins 6 caractères');
            }

            // Vérifier le format email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('Format d\'email invalide');
            }

            // Récupérer les utilisateurs existants
            const existingUsers = JSON.parse(localStorage.getItem('boldtrade_users') || '[]');
            
            // Vérifier si l'utilisateur existe déjà
            if (existingUsers.find(u => u.email === email)) {
                throw new Error('An account with this email already exists');
            }

            // Créer le nouvel utilisateur
            const newUser = {
                id: Date.now().toString(),
                email,
                password, // En production, il faudrait hasher le mot de passe
                createdAt: new Date().toISOString(),
                portfolio: {
                    balance: 10000, // Starting fictional balance
                    cryptos: {}
                },
                transactions: [] // Historique des transactions
            };

            // Sauvegarder l'utilisateur
            const updatedUsers = [...existingUsers, newUser];
            localStorage.setItem('boldtrade_users', JSON.stringify(updatedUsers));

            // Connecter automatiquement l'utilisateur
            const userSession = { id: newUser.id, email: newUser.email, portfolio: newUser.portfolio, transactions: newUser.transactions };
            setUser(userSession);
            localStorage.setItem('boldtrade_user', JSON.stringify(userSession));

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Login function
    const login = async (email, password) => {
        try {
            if (!email || !password) {
                throw new Error('Email et mot de passe requis');
            }

            // Récupérer les utilisateurs existants
            const existingUsers = JSON.parse(localStorage.getItem('boldtrade_users') || '[]');
            
            // Trouver l'utilisateur
            const foundUser = existingUsers.find(u => u.email === email && u.password === password);
            
            if (!foundUser) {
                throw new Error('Email ou mot de passe incorrect');
            }

            // Créer la session utilisateur
            const userSession = { 
                id: foundUser.id, 
                email: foundUser.email, 
                portfolio: foundUser.portfolio,
                transactions: foundUser.transactions || []
            };
            setUser(userSession);
            localStorage.setItem('boldtrade_user', JSON.stringify(userSession));

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem('boldtrade_user');
    };

    // Fonction pour mettre à jour le portfolio
    const updatePortfolio = (newPortfolio) => {
        if (!user) return;

        const updatedUser = { ...user, portfolio: newPortfolio };
        setUser(updatedUser);
        localStorage.setItem('boldtrade_user', JSON.stringify(updatedUser));

        // Mettre à jour aussi dans la liste des utilisateurs
        const existingUsers = JSON.parse(localStorage.getItem('boldtrade_users') || '[]');
        const updatedUsers = existingUsers.map(u => 
            u.id === user.id ? { ...u, portfolio: newPortfolio, transactions: user.transactions } : u
        );
        localStorage.setItem('boldtrade_users', JSON.stringify(updatedUsers));
    };

    // Fonction pour ajouter une transaction à l'historique
    const addTransaction = (transactionData) => {
        if (!user) return;

        const newTransaction = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            ...transactionData,
            timestamp: new Date().toISOString(),
            userId: user.id
        };

        const updatedTransactions = [newTransaction, ...(user.transactions || [])];
        
        // Créer l'utilisateur mis à jour avec les dernières données
        const updatedUser = { 
            ...user, 
            transactions: updatedTransactions,
            portfolio: user.portfolio // S'assurer que le portfolio est à jour
        };
        
        // Mettre à jour l'état local
        setUser(updatedUser);
        localStorage.setItem('boldtrade_user', JSON.stringify(updatedUser));

        // Mettre à jour dans la base des utilisateurs
        const existingUsers = JSON.parse(localStorage.getItem('boldtrade_users') || '[]');
        const updatedUsers = existingUsers.map(u => 
            u.id === user.id ? { 
                ...u, 
                portfolio: updatedUser.portfolio, 
                transactions: updatedTransactions 
            } : u
        );
        localStorage.setItem('boldtrade_users', JSON.stringify(updatedUsers));

        return newTransaction;
    };

    // Fonction de debug pour vérifier l'état de l'utilisateur
    const debugUserData = () => {
        console.log('Current user state:', user);
        console.log('localStorage user:', JSON.parse(localStorage.getItem('boldtrade_user') || 'null'));
        const users = JSON.parse(localStorage.getItem('boldtrade_users') || '[]');
        const currentUserInDB = users.find(u => u.id === user?.id);
        console.log('User in database:', currentUserInDB);
    };

    const value = {
        user,
        setUser,
        isLoading,
        login,
        register,
        logout,
        updatePortfolio,
        addTransaction,
        debugUserData,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };