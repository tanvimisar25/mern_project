import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import cardLogo from "./flash.png";
import "./index.css";

import { useAuth } from './AuthContext';

// --- Base Icons (Unchanged) ---
const HomeIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.122 0l8.954 8.955M2.25 12V21a.75.75 0 00.75.75H21a.75.75 0 00.75-.75V12M9 21V15a2.25 2.25 0 012.25-2.25h1.5A2.25 2.25 0 0115 15v6" /></svg> );
const DecksIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-1.142 0L2.25 7.5 12 2.25l9.75 5.25-5.571 3-5.571-3zM2.25 12l5.571 3 5.571-3m0 0l5.571 3L12 21.75l-9.75-5.25 5.571-3z" /></svg> );
const ProfileIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg> );

// --- FINAL, INTUITIVE OUTLINE ICONS FROM HEROICONS---
const CoreSkillsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
</svg>
);
const DSAIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
</svg>
);
const WebDevIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
</svg>
);
const DataScienceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
</svg>
);
const CloudDevOpsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
</svg>
);
const CybersecurityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
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
                <li>
                  <Link to="/core" className="sidebar-link">
                    <CoreSkillsIcon />
                    <span className="link-text">Core Interview Skills</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dsa" className="sidebar-link">
                    <DSAIcon />
                    <span className="link-text">DSA</span>
                  </Link>
                </li>
                <li>
                  <Link to="/webdev" className="sidebar-link">
                    <WebDevIcon />
                    <span className="link-text">Web Development</span>
                  </Link>
                </li>
                <li>
                  <Link to="/datascience" className="sidebar-link">
                    <DataScienceIcon />
                    <span className="link-text">Data Science and AI</span>
                  </Link>
                </li>
                <li>
                  <Link to="/cloudcomputing" className="sidebar-link">
                    <CloudDevOpsIcon />
                    <span className="link-text">Cloud and DevOps</span>
                  </Link>
                </li>
                <li>
                  <Link to="/cybersecurity" className="sidebar-link">
                    <CybersecurityIcon />
                    <span className="link-text">Cybersecurity</span>
                  </Link>
                </li>
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

        <div className={`main-content1 ${isSidebarHovered ? 'sidebar-is-hovered' : ''}`}>
          <Outlet />
        </div>
        
      </div>
    </div>
  );
}