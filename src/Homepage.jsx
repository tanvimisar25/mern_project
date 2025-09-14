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
          <button className="toggle-btn" title="Menu" onClick={this.toggleSidebar}>
            {this.state.sidebarOpen ? "☰" : "☰"}
          </button>

          {this.state.sidebarOpen && (
            <div className="sidebar-content">
              {/* Top Links */}
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
              <button className="signup-btn">Sign up</button>
            </Link>
          </div>
          <hr className="divider" />

          {/* New Section */}
          <div className="interview-section">
            <h2>For your next interview</h2>
            <div className="grid-container">
              {[
                { title: "General HR Questions", terms: "10 terms", link: "/generalquestions" },
                { title: "Data Structures & Algorithms", terms: "120 terms" },
                { title: "Database & SQL", terms: "90 terms" },
                { title: "Object-Oriented Programming", terms: "70 terms" },
                { title: "System Design Basics", terms: "60 terms" },
                { title: "Cybersecurity Fundamentals", terms: "65 terms" },
                { title: "Data Science & Machine Learning", terms: "110 terms" },
                { title: "Frontend Development", terms: "80 terms" },
                { title: "Backend & APIs", terms: "85 terms" },
              ].map((card, index) => (
                card.link ? (
                  <Link
                    key={index}
                    to={card.link}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="grid-item">
                      <h3 className="card-title">{card.title}</h3>
                      <span className="terms-badge">{card.terms}</span>
                    </div>
                  </Link>
                ) : (
                  <div key={index} className="grid-item">
                    <h3 className="card-title">{card.title}</h3>
                    <span className="terms-badge">{card.terms}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Homepage;
