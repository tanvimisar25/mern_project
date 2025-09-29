import React from 'react';
import { Link } from 'react-router-dom';

// Donut Chart component remains the same internally
const CuteDonutChart = () => {
  const segments = [ { value: 65, color: '#3b82f6' } ];
  const radius = 80;
  const strokeWidth = 20;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  return (
    <div className="hp-donut-chart-wrapper">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          className="hp-donut-track"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeWidth={strokeWidth}
        />
        {segments.map((segment, index) => (
          <circle
            key={index}
            className="hp-donut-segment"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeWidth={strokeWidth}
            stroke={segment.color}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference - (segment.value / 100 * circumference)}
          />
        ))}
      </svg>
    </div>
  );
};

function Homepage() {
  return (
    <div className="homepage-container">
      <div className="hp-main-content">
        <div className="hp-main-header">
          <h2>Welcome Back!</h2>
          <p>Here's a snapshot of your progress.</p>
        </div>

        {/* ✅ RENAMED: All class names here are now unique to the homepage */}
        <div className="hp-summary-card">
           <div className="hp-summary-grid">
            
            <div className="hp-chart-container-card">
              <CuteDonutChart />
            </div>

            <div className="hp-stats-container">
              <div className="hp-stat-card">
                <div className="hp-stat-header">
                  <h4>Accuracy</h4>
                  <p>92%</p>
                </div>
              </div>
              <div className="hp-stat-card">
                <div className="hp-stat-header">
                  <h4>Decks Completed</h4>
                  <p>60%</p>
                </div>
              </div>
              <div className="hp-stat-card">
                <div className="hp-stat-header">
                  <h4>Decks Mastered</h4>
                  <p>45%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Featured Decks section (Original class names preserved) --- */}
        <div className="decks-section">
          <div className="explore-decks-card">
            <h2><span className="title-expanded">Featured </span>Decks</h2>
            <div className="grid-container">
              {[
                { title: "General HR Questions", terms: "10 terms", link: "/generalquestions" },
                { title: "Data Structures & Algorithms", terms: "120 terms", link: "/dsa" },
                { title: "Database & SQL", terms: "90 terms", link: "/sql" },
                { title: "General HR Questions", terms: "10 terms", link: "/generalquestions" },
              ].map((card, index) => (
                <Link key={index} to={card.link || "#"} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="grid-item">
                    <h3 className="card-title">{card.title}</h3>
                    <span className="terms-badge">{card.terms}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;