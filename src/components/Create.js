import React from "react";
import { apiRequest } from "../utils/request";
import { useNavigate } from "react-router-dom";
import { useAuthenticated } from "../utils/auth";
import { useState } from "react";

const Create = () => {
  const navigate = useNavigate();
  const [token, setToken] = useAuthenticated();
  const [classroomName, setClassroomName] = useState("");
  const pushRequest = async (e) => {
    e.preventDefault();
    const { id, name, error } = await apiRequest({
      method: "POST",
      path: "/classrooms/create",
      token,
      setToken,
      navigate,
    });
    if (id) {
      navigate("/classrooms");
    } else {
      alert(error);
    }
  };

  return (
    <div className="container mt-3 text-center">
      <form>
        <h3>Class Room Name</h3>
        <div className="mb-3">
          <input
            value={classroomName}
            type="text"
            className="form-control"
            id="name"
            name="name"
            required
            onChange={(e) => setClassroomName(e.target.value)}
          />
        </div>
        <button type="submit" onClick={pushRequest} className="btn btn-primary">
          Create
        </button>
      </form>
    </div>
  );
};

export default Create;
