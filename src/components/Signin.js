import React from "react";
import { useUnauthenticated } from "../utils/auth";
import "./Signup.css";

const Signin = () => {
    const setToken = useUnauthenticated();
    return (
        <main className="form-signin">
            <form>
                <h1 className="h3 mb-3 fw-normal heading signupContainer">
                    <i className="fa-solid fa-screen-users"></i>Sign In
                </h1>
                <p>Get access to premium features</p>

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
                    <ul
                        className="dropdown-menu "
                        aria-labelledby="dropdownMenuButton1"
                    >
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
                    <img className="icon" src="lock.svg" alt="" /> Sign in
                </button>
                <p className="mt-5 mb-3 text-muted">&copy; 2022</p>
            </form>
        </main>
    );
};

export default Signin;
