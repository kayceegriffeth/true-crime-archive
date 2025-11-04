import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero-intro">
        <h1 className="hero-title">TRUE CRIME ARCHIVE</h1>
        <p className="hero-subtitle">
          Explore unsolved mysteries, organize your own case lists, and uncover the truth — all in one place.
        </p>

        <div className="hero-buttons d-flex justify-content-center gap-3 mt-3 flex-wrap">
          <Link to="/database" className="btn btn-outline-danger">
            🔍 Explore Cases
          </Link>
          <Link to="/my-cases" className="btn btn-outline-danger">
            🗂 My Cases
          </Link>
          <Link to="/collections" className="btn btn-outline-danger">
            💬 Collections
          </Link>
        </div>
      </section>

      {/* DASHBOARD */}
      <section className="dashboard-section">
        <div className="dashboard-row">
          <div className="feature-card text-center">
            <h6>🕵️‍♀️ Investigate</h6>
            <p>
              Dive into a growing database of famous and forgotten cases.
              Filter and track new leads.
            </p>
          </div>

          <div className="feature-card text-center">
            <h6>📁 Organize</h6>
            <p>
              Build your own case collections — Cold Cases, Serial Killers,
              Missing Persons, and more.
            </p>
          </div>

          <div className="feature-card text-center">
            <h6>⚖️ Analyze</h6>
            <p>
              See everything in one place. Review
              saved groups and cases to uncover the bigger picture.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
