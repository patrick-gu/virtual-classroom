import "./App.css";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/login" element={<Signin />} />
          <Route path="/register" element={<Signup />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
