import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Main from "./pages/Main";
import Registration from "./pages/Registration";
import Dashboard from "./pages/Dashboard";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/profile/:username" element={<Profile />} /> */}
        <Route path="*" element={<ErrorPage />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
      {/* } />
      <Route path="/" exact render={(props) => <Main />} /> */}
    </Router>
  );
}

export default App;
