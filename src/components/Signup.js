import React from "react";
import "./Signup.css";

const Signup = () => {
  return (
    <main className="form-signin">
      <form>
        <h1 className="h3 mb-3 fw-normal heading signupContainer">
          <i className="fa-solid fa-screen-users"></i>Create an account
        </h1>
        <p>Get access to premium features</p>

        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="fName"
            name="fName"
            placeholder="Shekhar"
          />
          <label for="fName">First Name</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="lName"
            name="lName"
            placeholder="name@example.com"
          />
          <label for="lName">Last Name</label>
        </div>
        <div className="form-floating">
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            placeholder="name@example.com"
          />
          <label for="email">Email address</label>
        </div>
        <div className="form-floating">
          <input
            type="number"
            max={12}
            min={1}
            className="form-control"
            id="grade"
            placeholder="Grade"
          />
          <label for="grade">Grade</label>
        </div>

        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
          />
          <label for="password">Password</label>
        </div>

        <div className="dropdown mb-3 mt-3">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Role
          </button>
          <ul className="dropdown-menu " aria-labelledby="dropdownMenuButton1">
            <li>
              <a className="dropdown-item" href="#">
                Teacher
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Student
              </a>
            </li>
          </ul>
        </div>
        <button className="w-100 btn btn-lg btn-primary" type="submit">
          <img className="icon" src="lock.svg" alt="" /> Sign up
        </button>
        <p className="mt-5 mb-3 text-muted">&copy; 2022</p>
      </form>
    </main>
  );
};

export default Signup;
