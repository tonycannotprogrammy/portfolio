import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Card from "./components/Card";
import About from "./components/AboutSquare";
import "./styles/Card.css";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Card />} />
      <Route path="/about" element={<About />} />
      <Route path="/about-me" element={<Navigate to="/about" replace />} />
    </Routes>
  </Router>
);

export default App;