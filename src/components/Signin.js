import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUnauthenticated } from "../utils/auth";
import "./Signup.css";

const Signin = () => {
  const setToken = useUnauthenticated();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const { success, error, token } = await response.json();
    if (success) {
      setToken(token);
      navigate("/classrooms");
    } else {
      alert(error);
    }
  };
  return (
    <main className="form-signin" onSubmit={onSubmit}>
      <form>
        <h1 className="h3 mb-3 fw-normal heading signupContainer">
          <i className="fa-solid fa-screen-users"></i>Sign In
        </h1>
        <p>Get access to premium features</p>

        <div className="form-floating">
          <input
            type="username"
            className="form-control"
            id="username"
            name="username"
            placeholder="name@example.com"
            onChange={(e) => setUsername(e.target.value)}
          />
          <label for="username">Username</label>
        </div>

        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <label for="password">Password</label>
        </div>
        <button className="w-100 btn btn-lg btn-primary" type="submit">
        <i class="fa-solid fa-lock"></i>  Sign in
        </button>
        <p className="mt-5 mb-3 text-muted">&copy; 2022</p>
      </form>
    </main>
  );
};

export default Signin;
