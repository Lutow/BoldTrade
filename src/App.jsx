import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home.jsx";
import './index.css'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    );
}

export default App;