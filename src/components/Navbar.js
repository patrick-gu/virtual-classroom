import React from "react";
import "./Navbar.css";
import { useAuthenticated } from "../utils/auth";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [token, setToken] = useAuthenticated();
  const navigate = useNavigate();
  const logout = () => {
    setToken(null);
    navigate("/login");
  };
  return (
    <nav className="navbar navbar-expand-lg bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          Virtuo
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          
            {token ? (
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="/profile">
                  Profile
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="/classes">
                  Classes
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Classroom
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <a className="dropdown-item" href="/classrooms/create">
                      Create Classroom
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/classrooms/join">
                      Join Classroom
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" href="/quiz/create">
                      Create Quiz
                    </a>
                  </li>
                </ul>
              </li>
              </ul>
            ) : (
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                <a className="nav-link" aria-current="page" href="/">
                  Home
                </a>
              </li>
                </ul>
            )}
           
     
          <div className="d-flex" role="auth">
            {token === null ? (
              <>
                <a className="btn btn-outline-success ms-3 login" href="/login">
                  Login
                </a>
                <a className="btn btn-outline-success" href="/register">
                  Register
                </a>
              </>
            ) : (
              <a
                className="btn btn-outline-success ms-3"
                onClick={logout}
                href="#"
              >
                Logout
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
