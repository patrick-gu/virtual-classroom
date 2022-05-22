import React from "react";
import {  useNavigate } from "react-router-dom";
import { useAuthenticated } from "../utils/auth";
import "./Profile.css";
import { useEffect, useState } from "react";
import { apiRequest } from "../utils/request";  

const Profile = ({ }) => {
  const [token, setToken] = useAuthenticated();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const logout = () => {
    setToken(null);
    navigate("/login");
  };
  useEffect(() => {
    (async () => {
      const { username , role } = await apiRequest({
        method: "GET",
        path: "/classrooms",
        token,
        setToken,
        navigate,
      });
      setUsername(username);
      setRole(role);
    })();
  }, [navigate, setToken, token]);

  return (
    <div className="profile">
      <div className="profile-container">
        <img className="profile-pic" src="download.png" alt="profile" />
        <h3>{`${username}`}</h3>
        <p>{role}</p>
        <a href={`mailto:arpitt682@gmail.com`}>
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
