import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ 1. IMPORT REALM
import * as Realm from "realm-web";

import SidebarLayout from "./SidebarLayout"; // NEW
import Homepage from "./Homepage";
import Login from "./Login";
import Signup from "./Signup";
import MyDeck from "./MyDeck";
import PracticeTest from "./PracticeTest";
import DeckOwn from "./DeckOwn";
import GeneralQuestions from "./GeneralQuestions";

// ✅ 2. INITIALIZE THE REALM APP AND EXPORT IT
const APP_ID = "realmwebsite-hyrdqzm"; 
export const app = new Realm.App({ id: APP_ID });

class App extends React.Component {
  render() {
    return (
      <Router>
        <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
          <Routes>
            {/* All pages with Sidebar */}
            <Route element={<SidebarLayout />}>
              <Route path="/" element={<Homepage />} />
              <Route path="/mydecks" element={<MyDeck />} />
              <Route path="/practicetests" element={<PracticeTest />} />
              <Route path="/deckowns" element={<DeckOwn />} />
              <Route path="/generalquestions" element={<GeneralQuestions />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;