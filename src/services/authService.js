// Service d'authentification pour gérer le stockage local
export const authService = {
    // Clés pour localStorage
    USERS_KEY: 'boldtrade_users',
    CURRENT_USER_KEY: 'boldtrade_user',

    // Récupérer tous les utilisateurs
    getAllUsers: () => {
        try {
            return JSON.parse(localStorage.getItem(authService.USERS_KEY) || '[]');
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            return [];
        }
    },

    // Sauvegarder un utilisateur
    saveUser: (user) => {
        try {
            const users = authService.getAllUsers();
            const updatedUsers = [...users, user];
            localStorage.setItem(authService.USERS_KEY, JSON.stringify(updatedUsers));
            return true;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
            return false;
        }
    },

    // Trouver un utilisateur par email
    findUserByEmail: (email) => {
        const users = authService.getAllUsers();
        return users.find(user => user.email === email);
    },

    // Mettre à jour un utilisateur existant
    updateUser: (userId, updatedData) => {
        try {
            const users = authService.getAllUsers();
            const updatedUsers = users.map(user => 
                user.id === userId ? { ...user, ...updatedData } : user
            );
            localStorage.setItem(authService.USERS_KEY, JSON.stringify(updatedUsers));
            return true;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
            return false;
        }
    },

    // Récupérer l'utilisateur actuellement connecté
    getCurrentUser: () => {
        try {
            const userString = localStorage.getItem(authService.CURRENT_USER_KEY);
            return userString ? JSON.parse(userString) : null;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur actuel:', error);
            return null;
        }
    },

    // Sauvegarder la session utilisateur
    saveUserSession: (user) => {
        try {
            localStorage.setItem(authService.CURRENT_USER_KEY, JSON.stringify(user));
            return true;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la session:', error);
            return false;
        }
    },

    // Supprimer la session utilisateur
    clearUserSession: () => {
        try {
            localStorage.removeItem(authService.CURRENT_USER_KEY);
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression de la session:', error);
            return false;
        }
    },

    // Valider un email
    validateEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Valider un mot de passe
    validatePassword: (password) => {
        return password && password.length >= 6;
    },

    // Créer un nouvel utilisateur
    createUser: (email, password) => {
        return {
            id: Date.now().toString(),
            email,
            password, // En production, il faudrait hasher le mot de passe
            createdAt: new Date().toISOString(),
            portfolio: {
                balance: 10000, // Starting fictional balance
                cryptos: {}
            }
        };
    }
};