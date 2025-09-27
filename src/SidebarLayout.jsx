import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import cardLogo from "./flash.png";
import "./index.css";

import { useAuth } from './AuthContext';

// --- (All your SVG Icon components remain exactly the same) ---
const HomeIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.122 0l8.954 8.955M2.25 12V21a.75.75 0 00.75.75H21a.75.75 0 00.75-.75V12M9 21V15a2.25 2.25 0 012.25-2.25h1.5A2.25 2.25 0 0115 15v6" /></svg> );
const DecksIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-5.571 3-5.571-3zM2.25 12l5.571 3 5.571-3m0 0l5.571 3L12 21.75l-9.75-5.25 5.571-3z" /></svg> );
const SkillIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-1.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /></svg> );
const AptitudeIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.085-1.085-1.085m0 0V14.25h2.17m-2.17 0H12m0 0v2.25m0 0h1.5m-1.5 0H9.75m4.5 0H12m0 0V3.75m0 0h-1.5m1.5 0H12m0 0h1.5m-1.5 0H9.75" /></svg> );
const AffairsIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" /></svg> );
const ComputerIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></svg>);
const ProfileIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg> );
const EngineeringIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0A2.25 2.25 0 0018 9.75v-.75a2.25 2.25 0 00-2.25-2.25h-1.5a2.25 2.25 0 00-2.25 2.25v.75m3 3.75A2.25 2.25 0 0018 14.25v.75a2.25 2.25 0 002.25 2.25h1.5a2.25 2.25 0 002.25-2.25v-.75a2.25 2.25 0 00-2.25-2.25h-1.5m-3-3.75A2.25 2.25 0 0012 9.75v-.75a2.25 2.25 0 00-2.25-2.25h-1.5A2.25 2.25 0 006 9.75v.75m3 3.75A2.25 2.25 0 0012 14.25v.75a2.25 2.25 0 002.25 2.25h1.5a2.25 2.25 0 002.25-2.25v-.75a2.25 2.25 0 00-2.25-2.25h-1.5M6 3.75A2.25 2.25 0 003.75 6v1.5a2.25 2.25 0 002.25 2.25h1.5A2.25 2.25 0 009 7.5V6A2.25 2.25 0 006.75 3.75H6z" /></svg>);
const MarketingIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.94" /></svg> );


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

export default function SidebarLayout() {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); 
    navigate('/'); 
  };

  return (
    <div className="layout-wrapper">
      <div className="bg-overlay"></div>
      <div className="layout">
        <aside
          className="sidebar"
          onMouseEnter={() => setIsSidebarHovered(true)}
          onMouseLeave={() => setIsSidebarHovered(false)}
        >
          <div className="sidebar-header">
            <Logo />
          </div>
          <div className="sidebar-content">
            <div className="sidebar-section">
              <p className="section-title">DISCOVER</p>
              <ul className="sidebar-menu">
                <li>
                  <Link to={currentUser ? "/dashboard" : "/"} className="sidebar-link">
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

            <div className="sidebar-section">
              <p className="section-title">CATEGORY</p>
              <ul className="sidebar-menu">
                {/* ✅ THIS IS THE KEY CHANGE */}
                {/* The 'a' tag is now a 'Link' component with a 'to' prop */}
                <li>
                  <Link to="/core" className="sidebar-link">
                    <SkillIcon />
                    <span className="link-text">Core Interview Skills</span>
                  </Link>
                </li>
                <li><a className="sidebar-link"><AptitudeIcon /><span className="link-text">General Aptitude</span></a></li>
                <li><a className="sidebar-link"><AffairsIcon /><span className="link-text">Current Affairs</span></a></li>
                <li><a className="sidebar-link"><EngineeringIcon /><span className="link-text">Engineering</span></a></li>
                <li><a className="sidebar-link"><ComputerIcon /><span className="link-text">Computer Science</span></a></li>
                <li><a className="sidebar-link"><MarketingIcon /><span className="link-text">Marketing and Sales</span></a></li>
              </ul>
            </div>
          </div>


          <div className="sidebar-footer">
            {currentUser ? (
              <a onClick={handleLogout} className="login-link" style={{cursor: 'pointer'}}>
                <ProfileIcon /> <span className="link-text">Logout</span>
              </a>
            ) : (
              <Link to="/login" className="login-link">
                <ProfileIcon /> <span className="link-text">Login</span>
              </Link>
            )}
          </div>
        </aside>

        <div className={`main-content ${isSidebarHovered ? 'sidebar-is-hovered' : ''}`}>
          <Outlet />
        </div>
        
      </div>
    </div>
  );
}