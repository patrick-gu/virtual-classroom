import { useUnauthenticated } from "../utils/auth";
import "./Home.css";
import { Link } from "react-router-dom";

export default function Home() {
  const setToken = useUnauthenticated();
  return (
    <div>
      <section id="title">
        <div class="container-fluid header">
          <div class="row">
            <div class="col-lg-6">
              <h1>Start learning today!</h1>
              <Link class="btn btn-dark btn-lg download-btn" to="/register">
              <i class="fa-solid fa-lock"></i> Join </Link>
              
            </div>
            
          </div>
        </div>
      </section>

      <section id="features">
        <div class="row">
          <div class="col-lg-4">
            <i class="fa-solid fa-circle-check feature-icon"></i>
            <h3>Easy to use.</h3>
            <p>Connect easily with your students</p>
          </div>

          <div class="col-lg-4">
            <i class="fa-solid fa-bullseye feature-icon"></i>
            <h3>Productive</h3>
            <p>We aims at increasing your productivity</p>
          </div>
          <div class="col-lg-4">
            <i class="fa-solid fa-heart feature-icon"></i>
            <h3>Growing</h3>
            <p>We are continously updating new features</p>
          </div>
        </div>
      </section>
    </div>
  );
}
