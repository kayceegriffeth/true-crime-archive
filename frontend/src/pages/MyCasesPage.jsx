// src/pages/MyCasesPage.jsx
import React, { useState } from "react";

export default function MyCasesPage() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("myCases");
    return saved ? JSON.parse(saved) : [];
  });

  const removeCase = (id) => {
    const updated = favorites.filter((item) => item.id !== id);
    setFavorites(updated);
    localStorage.setItem("myCases", JSON.stringify(updated));
  };

  if (favorites.length === 0) {
    return (
      <div className="my-cases-page">
        <h1 className="page-title">My Cases</h1>
        <p className="text-center mt-5 text-secondary">
          No saved cases yet. Add some from the Case Database.
        </p>
      </div>
    );
  }

  return (
    <div className="my-cases-page">
      <h1 className="page-title">My Cases</h1>

      <div className="my-cases-list">
        <div className="my-cases-header-row">
          <div>Case Name</div>
          <div>Victim</div>
          <div>Location</div>
          <div>Year</div>
          <div>Status</div>
        </div>

        {favorites.map((item) => {
          const location =
            item.locationCity && item.locationState
              ? `${item.locationCity}, ${item.locationState}`
              : item.locationCity || item.locationState || "—";

          const wikiUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(
            item.title
          )}`;

          return (
            <div key={item.id} className="my-case-row">
              <div>
                <a
                  href={wikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-title"
                  style={{ color: "#ff4747", textDecoration: "none" }}
                >
                  {item.title}
                </a>
              </div>
              <div>{item.victimName || "—"}</div>
              <div>{location}</div>
              <div>{item.year || "—"}</div>
              <div>
                <span
                  className={`status-badge status-${(item.status || "").toLowerCase()}`}
                >
                  {(item.status || "UNKNOWN").toUpperCase()}
                </span>
              </div>
              <div>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeCase(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
