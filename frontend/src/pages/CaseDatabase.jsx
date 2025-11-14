import React, { useEffect, useState } from "react";
import { useUserRole } from "../UserRoleContext";

export default function CaseDatabase() {
  const { role } = useUserRole(); // "ADMIN" or "USER"

  const [cases, setCases] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("myCases");
    return saved ? JSON.parse(saved) : [];
  });

  // -----------------------
  // FETCH ALL CASES (backend returns everything)
  // -----------------------
  const fetchCases = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/api/items");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setCases(Array.isArray(data) ? data : data.content || []);
    } catch (e) {
      console.error("Fetch /api/items failed:", e);
      setError("Unable to load case database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []); // load once

  // -----------------------
  // FETCH COLLECTIONS
  // -----------------------
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:8080/api/groups");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setCollections(Array.isArray(data) ? data : data.content || []);
      } catch (e) {
        console.error("Fetch /api/groups failed:", e);
      }
    })();
  }, []);

  // -----------------------
  // FAVORITES (My Cases)
  // -----------------------
  const addToMyCases = (caseItem) => {
    const updated = [...favorites, caseItem].filter(
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i
    );
    setFavorites(updated);
    localStorage.setItem("myCases", JSON.stringify(updated));
    alert(`${caseItem.title} added to My Cases!`);
  };

  // -----------------------
  // ADD TO COLLECTION (ADMIN ONLY)
  // -----------------------
  const addToCollection = async (caseItem) => {
    if (role !== "ADMIN") return alert("Only admins can add to collections.");
    if (!selectedGroup) return alert("Please select a collection first!");

    try {
      const res = await fetch(
        `http://localhost:8080/api/groups/${selectedGroup}/items/${caseItem.id}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );

      if (res.ok) alert(`${caseItem.title} added to collection!`);
      else alert(`Failed to add: ${res.statusText}`);
    } catch (e) {
      console.error("Add to collection failed:", e);
      alert("Error adding to collection.");
    }
  };

  // -----------------------
  // SEARCH (still uses backend /search, but we ALSO filter by visibility on frontend)
  // -----------------------
  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        keyword: searchTerm,
        location,
        sortBy: sortField,
        order: sortOrder,
      });

      const res = await fetch(
        `http://localhost:8080/api/items/search?${params.toString()}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCases(Array.isArray(data) ? data : data.content || []);
    } catch (e) {
      console.error(e);
      setError("Error searching cases.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // ROLE-BASED VISIBILITY FILTER (THIS is the important part)
  // -----------------------
  const visibleCases =
    role === "ADMIN"
      ? cases
      : cases.filter(
          (item) =>
            !item.visibility || item.visibility.toUpperCase() === "PUBLIC"
        );

  // -----------------------
  // RENDER
  // -----------------------
  if (loading) return <p className="text-center mt-5">Loading case database...</p>;
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;

  return (
    <div className="my-cases-page">
      <h1 className="page-title">Case Database</h1>

      {/* Search + Sort Controls */}
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
          placeholder="Filter by city..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
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
        <button
          onClick={handleSearch}
          className="btn btn-sm btn-outline-light"
          style={{ marginLeft: "10px" }}
        >
          Apply
        </button>
      </div>

      {/* Collection selector — only meaningful for ADMIN when adding to collections */}
      {role === "ADMIN" && (
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          <label htmlFor="collectionSelect" style={{ marginRight: "8px" }}>
            Add to Collection:
          </label>
          <select
            id="collectionSelect"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">-- Select a collection --</option>
            {collections.map((col) => (
              <option key={col.id} value={col.id}>
                {col.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {visibleCases.length === 0 ? (
        <p className="text-center text-secondary">No cases found.</p>
      ) : (
        <div className="my-cases-list">
          <div className="my-cases-header-row">
            <div>Case Name</div>
            <div>Victim</div>
            <div>Location</div>
            <div>Year</div>
            <div>Status</div>
          </div>

          {visibleCases.map((item) => {
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

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {/* Everyone can favorite */}
                  <button
                    className="btn btn-sm btn-outline-light"
                    onClick={() => addToMyCases(item)}
                  >
                    + My Cases
                  </button>

                  {/* Only ADMIN can add to collections */}
                  {role === "ADMIN" && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => addToCollection(item)}
                    >
                      + Add to Collection
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
