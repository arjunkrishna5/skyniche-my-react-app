import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reactLogo from '../assets/react.svg';
import viteLogo from '../assets/vite.svg';
import heroImg from '../assets/hero.png';
import '../App.css';

function ViteLanding() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  return (
    <div style={{
      width: "1126px",
      maxWidth: "100%",
      margin: "0 auto",
      textAlign: "center",
      borderLeft: "1px solid var(--border)",
      borderRight: "1px solid var(--border)",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
      position: "relative"
    }}>
      {/* Navigation Header with Browse Store & Sign In Buttons */}
      <header style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        padding: "20px 40px",
        position: "absolute",
        width: "100%",
        boxSizing: "border-box",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10
      }}>
        <button
          onClick={() => navigate('/shop')}
          style={{
            padding: "10px 20px",
            backgroundColor: "rgba(45, 212, 191, 0.15)",
            color: "#2dd4bf",
            border: "1px solid rgba(45, 212, 191, 0.4)",
            borderRadius: "6px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "rgba(45, 212, 191, 0.3)"}
          onMouseOut={(e) => e.target.style.backgroundColor = "rgba(45, 212, 191, 0.15)"}
        >
          Browse Store
        </button>

        <button
          onClick={() => navigate('/login')}
          style={{
            padding: "10px 20px",
            backgroundColor: "#0d9488",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(13, 148, 136, 0.2)",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#0f766e"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#0d9488"}
        >
          Sign In
        </button>
      </header>

      <section id="center" style={{ paddingTop: "100px" }}>
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank" rel="noreferrer">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank" rel="noreferrer">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank" rel="noreferrer">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank" rel="noreferrer">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank" rel="noreferrer">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank" rel="noreferrer">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </div>
  );
}

export default ViteLanding;
