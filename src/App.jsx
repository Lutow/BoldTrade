import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./Home/Home.jsx";
import './index.css'
import Register from "./Login+Register/Register.jsx";
import Login from "./Login+Register/Login.jsx";
import Exchange from "./Exchange page/Exchange.jsx";
import UserDashboard from "./Dashboard/UserDashboard.jsx";
import AddFunds from "./AddFunds/AddFunds.jsx";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <UserDashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/add-funds" 
                    element={
                        <ProtectedRoute>
                            <AddFunds />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/Exchange" 
                    element={<Exchange />} 
                />
            </Routes>
        </AuthProvider>
    );
}

export default App;
