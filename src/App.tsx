import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Card from "./components/Card";
import About from "./components/AboutSquare";
import VideoPlayer from "./components/VideoPlayer";
import SocialSlotPage from "./components/SocialSlotPage";
import "./styles/Card.css";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Card />} />
      <Route path="/about" element={<About />} />
      <Route path="/about-me" element={<Navigate to="/about" replace />} />
      <Route path="/mundane" element={<VideoPlayer />} />
      <Route path="/socials" element={<SocialSlotPage />} />
    </Routes>
  </Router>
);

export default App;