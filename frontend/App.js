import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import MFA from "./components/MFA";
import AdminPanel from "./components/AdminPanel";
import PACSViewer from "./components/PACSViewer";
import ExplainableAI from "./components/ExplainableAI";
import ResultChart from "./components/ResultChart";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/mfa" element={<MFA />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/pacs" element={<PACSViewer />} />
        <Route path="/explain" element={<ExplainableAI />} />
        <Route path="/results" element={<ResultChart />} />
      </Routes>
    </Router>
  );
}

export default App;
