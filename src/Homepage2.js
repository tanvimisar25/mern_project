import React from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "./Homepage2.css"; // Imports the separate CSS file

// --- MAIN HOMEPAGE COMPONENT ---
function Homepage2() {
  // --- UPDATED: Chart data now has 4 categories ---
  const chartData = [
    { name: "Completed Flashcards", value: 40, color: "#100a27" }, // Blue
    { name: "Mastered Flashcards", value: 20, color: "#281d55ff" }, // Orange
    { name: "Completed Tests", value: 25, color: "#635599ff" },      // Green
    { name: "Mastered Tests", value: 15, color: "#9a8cd3ff" },      // Purple
  ];

  const stats = {
    accuracy: 87,
    completed: 65,
    mastered: 45,
  };

  return (
    <div className="homepage-container">
      <div className="layout">
        {/* I've applied the fix here to make the header visible */}
        <div className="main-content2">
          <div className="main-header2">
            <h1>WELCOME BACK!!!</h1>
            <p className="header-subtitle">Continue your learning journey</p>
          </div>
          <div className="dashboard-grid">
            <div className="dashboard-card chart-card">
              {/* REMOVED: "Your Learning Progress" h3 element */}
              <div className="chart-wrapper">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={85}
                        outerRadius={150}
                        paddingAngle={3}
                        dataKey="value"
                        cornerRadius={10}
                        labelLine={false}
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke={entry.color}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* UPDATED: Legend now uses a new layout */}
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
          <div className="decks-section">
            <div className="explore-decks-card">
              <h2>
                <span className="title-expanded">Featured </span>Decks
              </h2>
              <div className="grid-container">
                {[
                  {
                    title: "General HR Questions",
                    terms: "20 decks",
                    link: "/generalquestions",
                  },
                  {
                    title: "Back End Development",
                    terms: "20 decks",
                    link: "/backend",
                  },
                  {
                    title: "Machine Learning",
                    terms: "20 decks",
                    link: "/machinelearning",
                  },
                  {
                    title: "Ethical Hacking",
                    terms: "20 decks",
                    link: "/ethicalhacking",
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
                  { short: "DEV", link: "/backend" },
                  { short: "ML", link: "/machinelearning" },
                  { short: "EH", link: "/ethicalhacking" },
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