import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "./Homepage2.css";
import { useAuth } from './AuthContext';
import { allDecks } from './decks';

// ✅ 1. THE MODAL COMPONENT IS NOW DEFINED INSIDE THIS FILE
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{children}</p>
        <div className="modal-actions">
          <button className="modal-button cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-button confirm" onClick={onConfirm}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

// --- DATA FOR A NEW USER'S CHART ---
const gettingStartedData = [
  { name: "Getting Started", value: 100, color: "#e0e0e0" }
];

// --- MAIN HOMEPAGE COMPONENT ---
function Homepage2() {
  const { currentUser, resetUserProgress } = useAuth();

  const [chartData, setChartData] = useState(gettingStartedData);
  const [stats, setStats] = useState({ accuracy: 0, completed: 0, mastered: 0 });
  const [hasProgress, setHasProgress] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal

  useEffect(() => {
    // ... (This useEffect logic remains the same)
    if (!currentUser || !currentUser.completedDecks) return;
    const totalFlashcards = allDecks.filter(d => d.type === 'flashcard').length;
    const totalTests = allDecks.filter(d => d.type === 'test').length;
    const totalDecks = totalFlashcards + totalTests;
    const completedFlashcards = Object.keys(currentUser.completedDecks.Flashcards || {}).length;
    const masteredFlashcards = Object.keys(currentUser.masteredDecks?.Flashcards || {}).length;
    const completedTests = Object.keys(currentUser.completedDecks.Tests || {}).length;
    const masteredTests = Object.keys(currentUser.masteredDecks?.Tests || {}).length;
    const totalProgressCount = completedFlashcards + masteredFlashcards + completedTests + masteredTests;
    if (totalProgressCount === 0) {
      setHasProgress(false);
      setChartData(gettingStartedData);
      setStats({ accuracy: 0, completed: 0, mastered: 0 });
    } else {
      setHasProgress(true);
      const completedFlashcardsValue = totalFlashcards > 0 ? (completedFlashcards / totalFlashcards) * 100 : 0;
      const masteredFlashcardsValue = totalFlashcards > 0 ? (masteredFlashcards / totalFlashcards) * 100 : 0;
      const completedTestsValue = totalTests > 0 ? (completedTests / totalTests) * 100 : 0;
      const masteredTestsValue = totalTests > 0 ? (masteredTests / totalTests) * 100 : 0;
      setChartData([
        { name: "Completed Flashcards", value: completedFlashcardsValue, color: "#002d46ff" },
        { name: "Mastered Flashcards", value: masteredFlashcardsValue, color: "#00456aff" },
        { name: "Completed Tests", value: completedTestsValue, color: "#005d90ff" },
        { name: "Mastered Tests", value: masteredTestsValue, color: "#0072afff" },
      ]);
      const accuracy = (currentUser.totalAnsweredQuestions > 0) ? Math.round((currentUser.totalCorrectAnswers / currentUser.totalAnsweredQuestions) * 100) : 0;
      const overallCompleted = totalDecks > 0 ? ((completedFlashcards + completedTests) / totalDecks) * 100 : 0;
      const overallMastered = totalDecks > 0 ? ((masteredFlashcards + masteredTests) / totalDecks) * 100 : 0;
      setStats({
        accuracy: accuracy,
        completed: Math.round(overallCompleted),
        mastered: Math.round(overallMastered),
      });
    }
  }, [currentUser]);

  // Function to run when the user confirms the reset
  const confirmReset = async () => {
    if (currentUser) {
      try {
        await resetUserProgress(currentUser.email);
      } catch (error) {
        alert("There was an error resetting your progress.");
      }
    }
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="homepage-container">
      <div className="layout">
        <div className="main-content2">
          <div className="main-header2">
             <h1>Welcome back {currentUser?.username || 'User'}!!!</h1>
             <p className="header-subtitle">Continue your learning journey</p>
          </div>
          <div className="dashboard-grid">
            <div className="dashboard-card chart-card">
              
              <div className="chart-card-header">
                <h3>Progress Overview</h3>
                <button onClick={() => setIsModalOpen(true)} className="reset-progress-button">
                  Reset
                </button>
              </div>

              <div className="chart-wrapper">
                 <div className="chart-container">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={120} paddingAngle={hasProgress ? 3 : 0} dataKey="value" cornerRadius={10} labelLine={false}>
                         {chartData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                         ))}
                       </Pie>
                     </PieChart>
                   </ResponsiveContainer>
                 </div>
               </div>
               <div className={`chart-legend ${!hasProgress ? 'centered' : ''}`}>
                 {chartData.map((item, idx) => (
                   <div key={idx} className="legend-item">
                     <div className="legend-color" style={{ backgroundColor: item.color }}></div>
                     <span className="legend-text">{item.name}</span>
                   </div>
                 ))}
               </div>
            </div>
            
            <div className="dashboard2-card">
              <h4>Total Accuracy Score</h4>
              <p className="stat-value">{stats.accuracy}%</p>
            </div>
            <div className="dashboard2-card">
              <h4>Completed Decks</h4>
              <p className="stat-value">{stats.completed}%</p>
            </div>
            <div className="dashboard2-card">
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
                   { title: "General HR Questions", terms: "20 decks", link: "/generalquestions" },
                   { title: "Back End Development", terms: "20 decks", link: "/backend" },
                   { title: "Machine Learning", terms: "20 decks", link: "/machinelearning" },
                   { title: "Ethical Hacking", terms: "20 decks", link: "/ethicalhacking" },
                 ].map((card, index) =>
                   <Link key={index} to={card.link} style={{ textDecoration: "none", color: "inherit" }}>
                     <div className="grid-item">
                       <h3 className="card-title">{card.title}</h3>
                       <span className="terms-badge">{card.terms}</span>
                     </div>
                   </Link>
                 )}
               </div>
               <div className="decks-collapsed-view">
                 {[
                   { short: "HR", link: "/generalquestions" },
                   { short: "DEV", link: "/backend" },
                   { short: "ML", link: "/machinelearning" },
                   { short: "EH", link: "/ethicalhacking" },
                 ].map((deck, index) =>
                   <Link key={index} to={deck.link} className="deck-bubble-link">
                     <div className="deck-bubble">{deck.short}</div>
                   </Link>
                 )}
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* ✅ RENDER THE MODAL (using the component defined at the top of this file) */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmReset}
        title="Are you sure?"
      >
        This will erase your accuracy score, completed decks, and mastered decks. This action cannot be undone.
      </ConfirmModal>
    </div>
  );
}

export default Homepage2;