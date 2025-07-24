import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Card from "./components/Card";
import About from "./components/AboutSquare";
import VideoPlayer from "./components/VideoPlayer";
import SocialSlotPage from "./components/SocialSlotPage";
import "./styles/Card.css";

// Hide the default cursor for the whole app
const appCursorStyle: React.CSSProperties = {
  cursor: "none",
};

const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: pos.x - 20,
        top: pos.y - 20,
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "#fff",
        pointerEvents: "none",
        mixBlendMode: "difference",
        zIndex: 9999,
        // Remove transition for instant movement
        transition: "none",
      }}
    />
  );
};

const ScrollPaginationWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const checkMobile = () => setShowCursor(window.innerWidth > 812);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Only enable scroll pagination on desktop and on the card page
    if (window.innerWidth <= 812) return;
    if (location.pathname !== "/") return;

    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let lastPage = 0;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = scrollContainer.scrollTop;
          const vh = window.innerHeight;
          const page = Math.round(scrollY / vh);
          if (page !== lastPage) {
            scrollContainer.scrollTo({
              top: page * vh,
              behavior: "smooth",
            });
            lastPage = page;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    scrollContainer.addEventListener("scroll", onScroll);
    return () => scrollContainer.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  // Mouse drag-to-scroll logic
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    let mouseDown = false;
    let startY = 0;
    let startScroll = 0;

    function onMouseDown(e: MouseEvent) {
      if (!scrollContainer) return;
      // Only left mouse button
      if (e.button !== 0) return;
      mouseDown = true;
      startY = e.clientY;
      startScroll = scrollContainer.scrollTop;
      scrollContainer.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
    }
    function onMouseMove(e: MouseEvent) {
      if (!mouseDown) return;
      if (!scrollContainer) return;
      const dy = e.clientY - startY;
      scrollContainer.scrollTop = startScroll - dy;
    }
    function onMouseUp() {
      if (!scrollContainer) return;
      mouseDown = false;
      scrollContainer.style.cursor = "auto";
      document.body.style.userSelect = "";
    }
    // Only enable on desktop
    if (window.innerWidth > 812) {
      scrollContainer.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      if (!scrollContainer) return;
      scrollContainer.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div style={appCursorStyle}>
      {showCursor && <CustomCursor />}
      <div className="scroll-container" ref={scrollRef}>
        {children}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollPaginationWrapper>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="section section-card">
                  <Card />
                </div>
              </>
            }
          />
          <Route
            path="/about"
            element={
              <div className="section section-card">
                <About />
              </div>
            }
          />
          <Route path="/about-me" element={<Navigate to="/about" replace />} />
          <Route
            path="/mundane"
            element={
              <div className="section section-card">
                <VideoPlayer />
              </div>
            }
          />
          <Route
            path="/socials"
            element={
              <div className="section section-card">
                <SocialSlotPage />
              </div>
            }
          />
        </Routes>
      </ScrollPaginationWrapper>
    </Router>
  );
};

export default App;