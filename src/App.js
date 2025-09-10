import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Homepage from "./Homepage";
import Login from "./Login";
import Signup from "./Signup";

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
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
