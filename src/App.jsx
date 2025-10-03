import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home.jsx";
import './index.css'
import Register from "./Login+Register/Register.jsx";
import Exchange from "./Exchange page/Exchange.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/Exchange" element={<Exchange />} />
        </Routes>
    );
}

export default App;
