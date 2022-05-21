import "./App.css";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Profile from "./components/Profile";
import Classes from "./components/Classes";
import Class from "./components/Class";
import { AuthContext, useTokenState } from "./utils/auth";
import Home from "./components/Home";

function App() {
    const [token, setToken] = useTokenState();
    return (
        <AuthContext.Provider value={[token, setToken]}>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route exact path="/login" element={<Signin />} />
                    <Route path="/register" element={<Signup />} />
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
                    <Route path="/classes" element={<Classes />} />
                    <Route path="/classes/:classId" element={<Class />} />
                    {/* We can pass values by fetching from database */}
                </Routes>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
