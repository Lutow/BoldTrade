import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

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
                }
            };

            // Sauvegarder l'utilisateur
            const updatedUsers = [...existingUsers, newUser];
            localStorage.setItem('boldtrade_users', JSON.stringify(updatedUsers));

            // Connecter automatiquement l'utilisateur
            const userSession = { id: newUser.id, email: newUser.email, portfolio: newUser.portfolio };
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
                portfolio: foundUser.portfolio 
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
            u.id === user.id ? { ...u, portfolio: newPortfolio } : u
        );
        localStorage.setItem('boldtrade_users', JSON.stringify(updatedUsers));
    };

    const value = {
        user,
        isLoading,
        login,
        register,
        logout,
        updatePortfolio,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};