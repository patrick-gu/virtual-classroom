import "./App.css";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Profile from "./components/Profile";
import Classes from "./components/Classes";
import Class from "./components/Class";
import { AuthContext, useTokenState } from "./utils/auth";
import Home from "./components/Home";
import Navbar from "./components/Navbar";

function App() {
  const [token, setToken] = useTokenState();

  return (
    <AuthContext.Provider value={[token, setToken]}>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Signin />} />
          <Route exact path="/register" element={<Signup />} />
          <Route
            path="/profile"
            element={
              <Profile
                fName="Shekhar"
                lName="Dangi"
                role="Teacher"
                email="arpitt682@gmail.com"
              />
            }
          />
          <Route exact path="/classes" element={<Classes />} />
          <Route exact path="/classes/:classId" element={<Class />} />
          {/* We can pass values by fetching from database */}
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
