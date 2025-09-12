import React from "react";
import { Link } from "react-router-dom"; // ✅ import Link
import { motion } from "framer-motion";
import cardLogo from "./flash.png";
import './index.css';


function Logo() {
  return (
    <div className="flex items-center gap-2">
      <motion.img
        src={cardLogo}
        alt="Prepdeck logo"
        className="w-10 h-10 object-contain"
        whileHover={{ rotateY: 180 }}
      />{" "}
      &nbsp;&nbsp;
      <span className="text-2xl font-bold inline-block align-middle" style={{ fontSize: "2.5rem" }}>
        Prepdeck
      </span>
    </div>
  );
}

class Homepage extends React.Component {
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
    return (
      <div className="layout">
        {/* Sidebar */}
        <aside
          className={`sidebar ${this.state.sidebarOpen ? "open" : "closed"}`}
        >
          <button className="toggle-btn" onClick={this.toggleSidebar}>
            {this.state.sidebarOpen ? "☰" : "☰"}
          </button>

          {this.state.sidebarOpen && (
            <div className="sidebar-content">
              {/* Top Links */}
              <div className="sidebar-section">
                <p className="section-title">Discover</p>
                <ul className="sidebar-menu">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/mydecks">My Decks</Link></li>
                    </ul>
              </div>
              <hr />

              {/* Deck Creator Section */}
              <div className="sidebar-section">
                <p className="section-title">Deck Creator</p>
                <ul className="sidebar-menu">
                  <li>New Deck</li>
                </ul>
              </div>
              <hr />

              {/* Category Section */}
              <div className="sidebar-section">
                <p className="section-title">Category</p>
                <ul className="sidebar-menu">
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
            {/* ✅ Login now navigates to /login */}
            <div className="topbar-login">
              <Link to="/Login">Login</Link>
            </div>
          </div>

          {/* Study Section */}
          <div className="study-section">
            <h1>Prepare for your next interview</h1>
            <p>
              Master essential questions and create custom flashcards with{" "}
              Prepdeck
            </p>
            {/* ✅ Signup now navigates to /signup */}
            <Link to="/signup">
    <button className="signup-btn">
  Sign up
</button>

  </Link>
          </div>
          <hr className="divider" />

          {/* New Section */}
          <div className="interview-section">
            <h2>For your next interview</h2>
            <div className="grid-container">
              {[
                { title: "World Capitals", terms: "197 terms" },
                { title: "27 Amendments", terms: "27 terms" },
                { title: "Biology Practice Test", terms: "83 terms" },
                { title: "Java Basics", terms: "54 terms" },
                { title: "Data Structures", terms: "102 terms" },
                { title: "Cyber Security", terms: "65 terms" },
                { title: "Marketing 101", terms: "88 terms" },
                { title: "UI/UX Principles", terms: "49 terms" },
                { title: "SQL Queries", terms: "77 terms" },
              ].map((card, index) => (
                <div key={index} className="grid-item">
                  <h3 className="card-title">{card.title}</h3>
                  <span className="terms-badge">{card.terms}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Homepage;