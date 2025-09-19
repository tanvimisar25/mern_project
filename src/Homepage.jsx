import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import cardLogo from "./flash.png";
import './index.css';

// --- New SVG Icon Components ---
// These are simple, outline-style icons like your reference image.

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.122 0l8.954 8.955M2.25 12V21a.75.75 0 00.75.75H21a.75.75 0 00.75-.75V12M9 21V15a2.25 2.25 0 012.25-2.25h1.5A2.25 2.25 0 0115 15v6" />
  </svg>
);

const DecksIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-5.571 3-5.571-3zM2.25 12l5.571 3 5.571-3m0 0l5.571 3L12 21.75l-9.75-5.25 5.571-3z" />
  </svg>
);

const SkillIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-1.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
  </svg>
);

const AptitudeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.085-1.085-1.085m0 0V14.25h2.17m-2.17 0H12m0 0v2.25m0 0h1.5m-1.5 0H9.75m4.5 0H12m0 0V3.75m0 0h-1.5m1.5 0H12m0 0h1.5m-1.5 0H9.75" />
  </svg>
);

const VerbalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
  </svg>
);

const AffairsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);


function Logo() {
  return (
    <div className="sidebar-logo">
      <motion.img
        src={cardLogo}
        alt="Prepdeck logo"
        className="logo-img"
        whileHover={{ rotateY: 180 }}
      />
      <span className="logo-text">PrepDeck</span>
    </div>
  );
}

class Homepage extends React.Component {
  render() {
    return (
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <Logo />
          </div>

          <div className="sidebar-content">
            {/* Discover Section */}
            <div className="sidebar-section">
              <p className="section-title">DISCOVER</p>
              <ul className="sidebar-menu">
                <li className="active">
                  <Link to="/" className="sidebar-link">
                    <HomeIcon /> <span className="link-text">Home</span>
                  </Link>
                </li>
                <li>
                  <Link to="/mydecks" className="sidebar-link">
                    <DecksIcon /> <span className="link-text">My Decks</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Category Section with new items */}
            <div className="sidebar-section">
              <p className="section-title">CATEGORY</p>
              <ul className="sidebar-menu">
                <li><a className="sidebar-link"><SkillIcon /><span className="link-text">Technical & Professional</span></a></li>
                <li><a className="sidebar-link"><AptitudeIcon /><span className="link-text">General Aptitude</span></a></li>
                <li><a className="sidebar-link"><VerbalIcon /><span className="link-text">Verbal and Reasoning</span></a></li>
                <li><a className="sidebar-link"><AffairsIcon /><span className="link-text">Current Affairs</span></a></li>
                {/* Simplified some long names to help them fit */}
                <li><a className="sidebar-link"><SkillIcon /><span className="link-text">Computer Science</span></a></li>
                <li><a className="sidebar-link"><AptitudeIcon /><span className="link-text">Engineering</span></a></li>
                <li><a className="sidebar-link"><DecksIcon /><span className="link-text">General Knowledge</span></a></li>
              </ul>
            </div>
          </div>

          {/* Footer with new Profile Icon */}
          <div className="sidebar-footer">
            <Link to="/Login" className="login-link">
              <ProfileIcon /> <span className="link-text">Login</span>
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="main-content">
          <div className="topbar">
            <div className="search-bar">
                <span>🔍</span>
                <input type="text" placeholder="Search decks..." />
            </div>
          </div>
          <div className="main-header">
            <h1>Let's get you ready for your next interview</h1>
            <p className="subtitle">
              Master essential questions and create custom flashcards with PrepDeck.
            </p>
          </div>
          <div className="decks-section">
            <h2>Explore Decks</h2>
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