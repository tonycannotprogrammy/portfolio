import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Card from "./components/Card";
import "./styles/Card.css";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Card />} />
      <Route path="/mycard" element={<Card />} />
    </Routes>
  </Router>
);

export default App;