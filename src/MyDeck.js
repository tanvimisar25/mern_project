import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import cardLogo from "./flash.png";
import "./MyDeck.css";
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
      <span className="text-2xl font-bold inline-block align-middle">
        Prepdeck
      </span>
    </div>
  );
}

class MyDeck extends React.Component {
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
    // ✅ Get the current path to determine the active tab
    const currentPath = window.location.pathname;

    return (
      <div className="mydeck-container">
        <div className="layout">
          {/* Sidebar */}
          <aside
            className={`sidebar ${this.state.sidebarOpen ? "open" : "closed"}`}
          >
            <button className="toggle-btn" onClick={this.toggleSidebar}>
              ☰
            </button>

            {this.state.sidebarOpen && (
              <div className="sidebar-content">
                {/* Top Links */}
                <div className="sidebar-section">
                  <p className="section-title">Discover</p>
                  <ul className="sidebar-menu no-bullets">
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    <li>
                      <Link to="/mydecks">My Decks</Link>
                    </li>
                  </ul>
                </div>
                <hr />

                {/* Deck Creator Section */}
                <div className="sidebar-section">
                  <p className="section-title">Deck Creator</p>
                  <ul className="sidebar-menu no-bullets">
                    <li>New Deck</li>
                  </ul>
                </div>
                <hr />

                {/* Category Section */}
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

            {/* Main Content */}
            <div className="mydeck-main">
              {/* Header */}
              <h1 className="mydeck-title">Your Decks</h1>

              {/* ✅ Tabs with dynamic "active" class */}
              <div className="mydeck-tabs">
                <Link to="/mydecks" className={currentPath === '/mydecks' ? 'active' : ''}>
                  Flashcard sets
                </Link>
                <Link to="/practicetests" className={currentPath === '/practicetests' ? 'active' : ''}>
                  Practice tests
                </Link>
                <Link to="/deckowns" className={currentPath === '/deckowns' ? 'active' : ''}>
                  Decks
                </Link>
              </div>

              {/* Deck List */}
              <div className="deck-list">
                <div className="deck-item">
                  <p className="deck-meta">20 Terms · React Basics</p>
                </div>
                <div className="deck-item">
                  <p className="deck-meta">15 Terms · Python Fundamentals</p>
                </div>
                <div className="deck-item">
                  <p className="deck-meta">12 Terms · UI/UX Principles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MyDeck;