import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import cardLogo from "./flash.png";
import "./DeckOwn.css"; // Using a dedicated CSS file for this component
import "./index.css";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <motion.img
        src={cardLogo}
        alt="Prepdeck logo"
        className="w-10 h-10 object-contain"
        whileHover={{ rotateY: 180 }}
      />
      &nbsp;&nbsp;
      <span className="text-2xl font-bold inline-block align-middle" style={{ fontSize: "2.5rem" }}>
        Prepdeck
      </span>
    </div>
  );
}

class DeckOwn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: true,
    };
  }

  toggleSidebar = () => {
    this.setState({ sidebarOpen: !this.state.sidebarOpen });
  };

  render() {
    // Get the current path to manually set the active tab
    const currentPath = window.location.pathname;

    return (
      <div className="layout">
        {/* Sidebar */}
        <aside
          className={`sidebar ${this.state.sidebarOpen ? "open" : "closed"}`}
        >
          <button className="toggle-btn" title="Menu" onClick={this.toggleSidebar}>
            ☰
          </button>

          {this.state.sidebarOpen && (
            <div className="sidebar-content">
              {/* Sidebar sections */}
              <div className="sidebar-section">
                <p className="section-title">Discover</p>
                <ul className="sidebar-menu">
                  <li>
                    <Link to="/" className="sidebar-link">Home</Link>
                  </li>
                  <li>
                    <Link to="/mydecks" className="sidebar-link">My Decks</Link>
                  </li>
                </ul>
              </div>
              <hr />
              <div className="sidebar-section">
                <p className="section-title">Deck Creator</p>
                <ul className="sidebar-menu no-bullets">
                  <li>New Deck</li>
                </ul>
              </div>
              <hr />
              <div className="sidebar-section">
                <p className="section-title">Category</p>
                <ul className="sidebar-menu no-bullets">
                  <li>Software Development</li>
                  <li>Data Science</li>
                  <li>Cyber Security</li>
                  <li>Marketing and Sales</li>
                  <li>UI/UX</li>
                </ul>
              </div>
            </div>
          )}
        </aside>

        {/* Main Section */}
        <div className="main">
          {/* Topbar */}
          <div className="topbar">
            <div className="logo-wrapper">
              <Logo />
            </div>
            <div className="topbar-login">
              <Link to="/Login">Login</Link>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="mydeck-main">
            {/* Header */}
            <h1 className="mydeck-title">Your Decks</h1>

            {/* Tab bar with corrected logic */}
            <div className="practice-test-tabs">
              <Link to="/mydecks" className={currentPath === '/mydecks' ? 'active' : ''}>
                Flashcard sets
              </Link>
              <Link to="/practicetests" className={currentPath === '/practicetests' ? 'active' : ''}>
                Practice tests
              </Link>
              {/* ✅ CORRECTED a typo here. The path is now '/decks' */}
              <Link to="/deckowns" className={currentPath === '/deckowns' ? 'active' : ''}>
                Decks
              </Link>
            </div>

            {/* Centered content */}
            <div className="practice-test-content">
              <div className="practice-test-icon">📝</div>
              <h2 className="practice-test-headline">
                Generate your own decks and practice
              </h2>
              <button className="start-generating-btn">Start generating</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DeckOwn;
