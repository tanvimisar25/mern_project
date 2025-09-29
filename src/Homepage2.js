import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "./Homepage2.css";

const InfoFlipCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  const handleSignUpClick = (e) => {
    e.stopPropagation();
    navigate("/SignUp");
  };

  return (
    <div className="info-card-container">
      <div
        className={`info-card ${isFlipped ? "is-flipped" : ""}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="info-card-face info-card-front">
          <h2>Flip me!</h2>
        </div>

        <div className="info-card-face info-card-back">
          <div className="info-card-content">
            <h3>Why PrepDeck?</h3>
            <ul>
              <li>&#10004; Master key concepts with curated flashcards.</li>
              <li>&#10004; Test your knowledge with targeted MCQs.</li>
              <li>&#10004; Build the confidence to ace your next interview.</li>
            </ul>
            <button className="signup-button" onClick={handleSignUpClick}>
              Unlock Your Potential by Signing up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function Homepage2() {
  // Donut chart data
  const chartData = [
    { name: "Mastered", value: 45, color: "#10b981" },
    { name: "In Progress", value: 30, color: "#3b82f6" },
    { name: "Not Started", value: 25, color: "#e5e7eb" },
  ];

  // Stats data
  const stats = {
    accuracy: 87,
    completed: 65,
    mastered: 45,
  };

  return (
    <div className="homepage-container">
      <div className="layout">
        <div className="main-content2">
          {/* Header Section */}
          <div className="main-header">
            {/* <p className="header-subtitle">Track Your Progress</p> */}
            <h1>WELCOME BACK!!!</h1>
            <p className="header-subtitle">Continue your learning journey</p>
          </div>

          {/* Dashboard Section */}
          <div className="dashboard-grid">
            {/* Donut Chart */}
            <div className="dashboard-card chart-card">
              <h3>Your Learning Progress</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={130}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-legend">
                {chartData.map((item, idx) => (
                  <div key={idx} className="legend-item">
                    <div
                      className="legend-color"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="legend-text">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Boxes */}
            <div className="dashboard2-card stat-card">
              <h4>Total Accuracy Score</h4>
              <p className="stat-value">{stats.accuracy}%</p>
            </div>

            <div className="dashboard2-card stat-card">
              <h4>Completed Decks</h4>
              <p className="stat-value">{stats.completed}%</p>
            </div>

            <div className="dashboard2-card stat-card">
              <h4>Mastered Decks</h4>
              <p className="stat-value">{stats.mastered}%</p>
            </div>
          </div>

          {/* Featured Decks */}
          <div className="decks-section">
            <div className="explore-decks-card">
              <h2>
                <span className="title-expanded">Featured </span>Decks
              </h2>

              <div className="grid-container">
                {[
                  {
                    title: "General HR Questions",
                    terms: "10 terms",
                    link: "/generalquestions",
                  },
                  { title: "Data Structures & Algorithms", terms: "120 terms" },
                  { title: "Database & SQL", terms: "90 terms" },
                  {
                    title: "General HR Questions",
                    terms: "10 terms",
                    link: "/generalquestions",
                  },
                ].map((card, index) =>
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
                )}
              </div>

              <div className="decks-collapsed-view">
                {[
                  { short: "HR", link: "/generalquestions" },
                  { short: "DSA", link: "/dsa" },
                  { short: "SQL", link: "/sql" },
                  { short: "HR", link: "/generalquestions" },
                ].map((deck, index) =>
                  deck.link ? (
                    <Link key={index} to={deck.link} className="deck-bubble-link">
                      <div className="deck-bubble">{deck.short}</div>
                    </Link>
                  ) : (
                    <div key={index} className="deck-bubble">
                      {deck.short}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage2;
