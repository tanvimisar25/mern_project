import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Homepage from "./Homepage";
import Login from "./Login";
import Signup from "./Signup";
import MyDeck from "./MyDeck";
import PracticeTest from "./PracticeTest";
import DeckOwn from "./DeckOwn";

class App extends React.Component {
  render() {
    return (
      <Router>
        <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
          

          {/* Routes */}
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/mydecks" element={<MyDeck/>}/>
            <Route path="/practicetests" element={<PracticeTest />} />
            <Route path="/deckowns" element={<DeckOwn />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;