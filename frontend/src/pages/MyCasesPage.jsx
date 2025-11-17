// src/pages/MyCasesPage.jsx
import React, { useState, useMemo } from "react";

export default function MyCasesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("myCases");
    return saved ? JSON.parse(saved) : [];
  });

  const removeCase = (id) => {
    const updated = favorites.filter((item) => item.id !== id);
    setFavorites(updated);
    localStorage.setItem("myCases", JSON.stringify(updated));
  };

  // ----------------------------
  // FILTER + SORT FAVORITES
  // ----------------------------
  const filteredCases = useMemo(() => {
    let list = [...favorites];

    // Search by title or victim
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          (item.victimName || "").toLowerCase().includes(term)
      );
    }

    // Filter by location (city OR state)
    if (locationFilter.trim() !== "") {
      const loc = locationFilter.toLowerCase();
      list = list.filter(
        (item) =>
          (item.locationCity || "").toLowerCase().includes(loc) ||
          (item.locationState || "").toLowerCase().includes(loc)
      );
    }

    // Sorting
    list.sort((a, b) => {
      let A = a[sortField] ?? "";
      let B = b[sortField] ?? "";

      // Make numeric sorts work
      if (sortField === "year") {
        A = Number(A) || 0;
        B = Number(B) || 0;
      } else {
        A = A.toString().toLowerCase();
        B = B.toString().toLowerCase();
      }

      if (A < B) return sortOrder === "asc" ? -1 : 1;
      if (A > B) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [favorites, searchTerm, locationFilter, sortField, sortOrder]);

  // ----------------------------
  // RENDER
  // ----------------------------
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

      {/* Filters + Sort */}
      <div className="filters" style={{ textAlign: "center", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by case or victim..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: "10px" }}
        />

        <input
          type="text"
          placeholder="Filter by city or state..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          style={{ marginRight: "10px" }}
        />

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          style={{ marginRight: "10px" }}
        >
          <option value="title">Case Name</option>
          <option value="year">Year</option>
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="my-cases-list">
        <div className="my-cases-header-row">
          <div>Case Name</div>
          <div>Victim</div>
          <div>Location</div>
          <div>Year</div>
          <div>Status</div>
        </div>

        {filteredCases.map((item) => {
          const loc =
            item.locationCity && item.locationState
              ? `${item.locationCity}, ${item.locationState}`
              : item.locationCity || item.locationState || "—";

          const wikiUrl = item.wikiUrl
            ? item.wikiUrl
            : `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(
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
              <div>{loc}</div>
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
