import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";

// Import all your page and layout components
import Homepage2 from "./Homepage2";
import SidebarLayout from "./SidebarLayout";
import Homepage from "./Homepage";
import Login from "./Login";
import Signup from "./Signup";
import MyDeck from "./MyDeck";
import GeneralQuestions from "./GeneralQuestions";
import BehavioralQuestions from "./BehavioralQuestions";
import SituationalQuestions from "./SituationalQuestions";
import ResumeDive from "./ResumeDive";
import Core from "./Core";
import ArrayString from "./ArrayString";
import TreeGraph from "./TreeGraph";
import Dynamic from "./Dynamic";
import SearchSort from "./SearchSort";
import DSA from "./DSA";
import WebDev from "./WebDev";
import FrontEnd from "./FrontEnd";
import BackEnd from "./BackEnd";
import JS from "./JS";
import VersionControl from "./VersionControl";
import DataScience from "./DataScience";
import MachineLearning from "./MachineLearning";
import Python from "./Python";
import Stats from "./Stats";
import DeepLearning from "./DeepLearning";
import CloudComputing from "./CloudComputing";
import CloudPlatforms from "./CloudPlatforms";
import Containerization from "./Containerization";
import Pipelines from "./Pipelines";
import Infrastructure from "./Infrastructure";
import CyberSecurity from "./CyberSecurity";
import NetworkSecurity from "./NetworkSecurity";
import AppSecurity from "./AppSecurity";
import Cryptography from "./Cryptography";
import EthicalHacking from "./EthicalHacking";

const ProtectedRoute = () => {
  const { currentUser } = useAuth();

  // If the user is NOT logged in, redirect them to the /login page
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If the user IS logged in, show the page they were trying to access
  return <Outlet />;
};

const PublicRoute = () => {
    const { currentUser } = useAuth();

    // If a user IS logged in, redirect them away from the public page to their dashboard.
    if (currentUser) {
        return <Navigate to="/dashboard" />;
    }

    // If they are NOT logged in, show the public page they were trying to access.
    return <Outlet />;
};


function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
          <Routes>
            <Route element={<SidebarLayout />}>
              
              {/* --- Public Routes --- */}
              <Route element={<PublicRoute />}>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Route>

              {/* --- Protected Routes --- */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Homepage2 />} />
                <Route path="/mydecks" element={<MyDeck />} />
                <Route path="/generalquestions" element={<GeneralQuestions />} />
                <Route path="/behavioralquestions" element={<BehavioralQuestions />} />
                <Route path="/situationalquestions" element={<SituationalQuestions />} />
                <Route path="/resumedive" element={<ResumeDive />} />
                <Route path="/core" element={<Core />} />
                <Route path="/arraystring" element={<ArrayString />} />
                <Route path="/treegraph" element={<TreeGraph />} />
                <Route path="/dynamic" element={<Dynamic />} />
                <Route path="/searchsort" element={<SearchSort />} />
                <Route path="/dsa" element={<DSA />} />
                <Route path="/webdev" element={<WebDev />} />
                <Route path="/frontend" element={<FrontEnd />} />
                <Route path="/backend" element={<BackEnd />} />
                <Route path="/js" element={<JS />} />
                <Route path="/versioncontrol" element={<VersionControl />} />
                <Route path="/datascience" element={<DataScience />} />
                <Route path="/machinelearning" element={<MachineLearning />} />
                <Route path="/python" element={<Python />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/deeplearning" element={<DeepLearning />} />
                <Route path="/cloudcomputing" element={<CloudComputing />} />
                <Route path="/cloudplatforms" element={<CloudPlatforms />} />
                <Route path="/containerization" element={<Containerization />} />
                <Route path="/pipelines" element={<Pipelines />} />
                <Route path="/infrastructure" element={<Infrastructure />} />
                <Route path="/cybersecurity" element={<CyberSecurity />} />
                <Route path="/networksecurity" element={<NetworkSecurity />} />
                <Route path="/appsecurity" element={<AppSecurity />} />
                <Route path="/cryptography" element={<Cryptography />} />
                <Route path="/ethicalhacking" element={<EthicalHacking />} />
              </Route>

            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;