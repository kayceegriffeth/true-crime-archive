import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { UserRoleProvider, useUserRole } from "./UserRoleContext";

import HomePage from "./pages/HomePage.jsx";
import CaseDatabase from "./pages/CaseDatabase.jsx";
import MyCasesPage from "./pages/MyCasesPage.jsx";
import MyCollectionsPage from "./pages/MyCollectionsPage.jsx";
import CollectionDetailPage from "./pages/CollectionDetailPage.jsx";
import CaseDetailPage from "./pages/CaseDetailPage.jsx";

function NavBar() {
  const { role, toggleRole } = useUserRole();

  return (
    <nav className="navbar navbar-expand-lg bg-dark fixed-top px-4 py-3 shadow-sm">
      <div className="container-fluid">
        <NavLink className="navbar-brand fw-bold text-uppercase" to="/">
          🧤 True Crime Archive
        </NavLink>

        <button
          className="navbar-toggler text-light border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          ☰
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto gap-3">
            <li className="nav-item"><NavLink to="/" className="nav-link">Home</NavLink></li>
            <li className="nav-item"><NavLink to="/database" className="nav-link">Case Database</NavLink></li>
            <li className="nav-item"><NavLink to="/my-cases" className="nav-link">My Cases</NavLink></li>
            <li className="nav-item"><NavLink to="/collections" className="nav-link">Collections</NavLink></li>
          </ul>

          <button
            className="btn btn-outline-light ms-3"
            onClick={toggleRole}
          >
            Switch to {role === "USER" ? "Admin" : "User"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <UserRoleProvider>
      <BrowserRouter>
        <NavBar />

        {/* Persistent wrapper to prevent flicker */}
        <div className="page-wrapper">
          <main className="page-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/database" element={<CaseDatabase />} />
              <Route path="/my-cases" element={<MyCasesPage />} />
              <Route path="/collections" element={<MyCollectionsPage />} />
              <Route path="/collections/:id" element={<CollectionDetailPage />} />
              <Route path="/cases/:id" element={<CaseDetailPage />} />
            </Routes>
          </main>
        </div>

        <footer className="text-center py-4 mt-5 border-top">
          <p className="mb-1">
            © {new Date().getFullYear()} True Crime Archive · Built with 💻 + 🔍 by Kaycee Griffeth
          </p>
          <p className="mb-0">
            <a href="https://github.com/kayceegriffeth" target="_blank" rel="noreferrer">
              View on GitHub
            </a>
          </p>
        </footer>
      </BrowserRouter>
    </UserRoleProvider>
  );
}
