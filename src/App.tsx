import React, { useEffect, useRef, useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Card from "./components/Card";
import UnderConstruction from "./components/UnderConstruction";
import LinksPage from "./components/LinksPage";
import TopMenu from "./components/TopMenu";
import MobileMenu from "./components/MobileMenu";
import "./styles/Card.css";

// Erstelle einen Kontext für den Cursor-Status
export const CursorContext = createContext<{ showCursor: boolean; setShowCursor: React.Dispatch<React.SetStateAction<boolean>> }>(
  { showCursor: true, setShowCursor: () => {} }
);

// Hide the default cursor for the whole app
const appCursorStyle: React.CSSProperties = {
  cursor: "none",
};

const CustomCursor: React.FC<{ visible: boolean; pressed: boolean }> = ({ visible, pressed }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  if (!visible) return null;

  const baseSize = 40;
  return (
    <div
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: baseSize,
        height: baseSize,
        borderRadius: "50%",
        background: "#fff",
        pointerEvents: "none",
        mixBlendMode: "difference",
        zIndex: 9999,
        transform: `translate(-50%, -50%) scale(${pressed ? 0.65 : 1})`,
        transition: "transform 120ms ease",
      }}
    />
  );
};

const ScrollPaginationWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [showCursor, setShowCursor] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [cursorPressed, setCursorPressed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 812;
      setIsMobile(isMobileDevice);
      setShowCursor(!isMobileDevice);
    };
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

  // Cursor press animation on desktop
  useEffect(() => {
    if (isMobile) return;
    const down = () => setCursorPressed(true);
    const up = () => setCursorPressed(false);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    window.addEventListener("blur", up);
    return () => {
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("blur", up);
    };
  }, [isMobile]);

  // Force-hide native cursor via root class; more robust than inline styles
  useEffect(() => {
    const root = document.documentElement;
    if (!isMobile) {
      root.classList.add("hide-native-cursor");
      return () => root.classList.remove("hide-native-cursor");
    }
    root.classList.remove("hide-native-cursor");
  }, [isMobile]);

  return (
    <CursorContext.Provider value={{ showCursor, setShowCursor }}>
      <div style={!isMobile ? appCursorStyle : undefined}>
        {!isMobile && <CustomCursor visible={showCursor} pressed={cursorPressed} />}
        <div className="scroll-container" ref={scrollRef}>
          {children}
        </div>
      </div>
    </CursorContext.Provider>
  );
};

const TitleUpdater: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    const map: Record<string, string> = {
      "/": "tony's card.",
      "/works": "tony's works.",
      "/about": "about tony.",
      "/links": "tony's links.",
    };
    document.title = map[location.pathname] ?? "tony's card.";
  }, [location.pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollPaginationWrapper>
        <TitleUpdater />
        <TopMenu />
        <MobileMenu />
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
          <Route path="/about" element={<UnderConstruction />} />
          <Route path="/works" element={<UnderConstruction />} />
          <Route path="/links" element={<LinksPage />} />
        </Routes>
      </ScrollPaginationWrapper>
    </Router>
  );
};

export default App;
