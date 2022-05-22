import React from "react";
import { apiRequest } from "../utils/request";
import { useNavigate } from "react-router-dom";
import { useAuthenticated } from "../utils/auth";
import { useState } from "react";

const Create = () => {
  const navigate = useNavigate();
  const [token, setToken] = useAuthenticated();
  const [code, setCode] = useState("");
  const pushRequest = async (e) => {
    e.preventDefault();
    const { classroomId, classroomName, error } = await apiRequest({
      method: "POST",
      path: "/classrooms/join",
      token,
      setToken,
      navigate,
      body: { id: code},
    });
    if (classroomId) {
      alert(classroomName);
    } else {
      alert(error);
    }
  };

  return (
    <div className="container mt-3 text-center">
      <form>
        <h3>Class Room ID</h3>
        <div className="mb-3">
          <input
            value={code}
            type="text"
            className="form-control"
            id="name"
            name="code"
            required
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <button type="submit" onClick={pushRequest} className="btn btn-primary">
          Join
        </button>
      </form>
    </div>
  );
};

export default Create;
