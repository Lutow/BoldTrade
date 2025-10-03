import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home.jsx";
import './index.css'
import Register from "./Login+Register/Register.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Register />} />
        </Routes>
    );
}

export default App;
