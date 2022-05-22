import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthenticated } from "../utils/auth";
import "./Profile.css";

const Profile = ({ fName, lName, role, email }) => {
  const [token, setToken] = useAuthenticated();
  const navigate = useNavigate();
  const logout = () => {
    setToken(null);
    navigate("/login");
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <img className="profile-pic" src="download.png" alt="profile" />
        <h3>{`${fName} ${lName}`}</h3>
        <p>{role}</p>
        <a href="mailto:{email}">
          <img
            className="icon"
            src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-email-512.png"
            alt="email"
          />
        </a>
      </div>
    </div>
  );
};

export default Profile;
