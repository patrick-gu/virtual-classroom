import React from "react";
import "./Profile.css";

const Profile = ({ fName, lName, role, email }) => {
  return (
    <div className="profile">
      <div className="profile-container">
        <img className="profile-pic" src="download.png" alt="profile" />
        <h3>{`${fName} ${lName}`}</h3>
        <p>{role}</p>
        <a href="mailto:{email}"><img className="icon" src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-email-512.png" alt="email" /></a>
      </div>
    </div>
  );
};

export default Profile;
