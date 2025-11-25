import React, { useEffect, useState, useRef } from "react";
import { useUserRole } from "../UserRoleContext";

export default function CaseDatabase() {
  const { role, userId } = useUserRole();

  const [cases, setCases] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");

  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:8080/api/items");
        const data = await res.json();
        setCases(Array.isArray(data) ? data : data.content || []);
      } catch (e) {
        setError("Unable to load items.");
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:8080/api/groups");
        const data = await res.json();
        setCollections(Array.isArray(data) ? data : data.content || []);
      } catch (e) {
        console.error("Error loading collections:", e);
      }
    })();
  }, []);

  const runSearch = async () => {
    try {
      const params = new URLSearchParams({
        keyword: searchTerm,
        location,
        sortBy: sortField,
        order: sortOrder,
      });

      const res = await fetch(
        `http://localhost:8080/api/items/search?${params.toString()}`
      );
      const data = await res.json();
      setCases(Array.isArray(data) ? data : data.content || []);
    } catch (e) {
      setError("Search failed.");
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(runSearch, 300);
  }, [searchTerm, location, sortField, sortOrder]);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("myCases");
    return saved ? JSON.parse(saved) : [];
  });

  const addToMyCases = (caseItem) => {
    const updated = [...favorites, caseItem].filter(
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i
    );
    setFavorites(updated);
    localStorage.setItem("myCases", JSON.stringify(updated));
    alert(`${caseItem.title} added to My Cases!`);
  };

  const addToCollection = async (caseItem) => {
    if (!selectedGroup) return alert("Please select your collection first!");

    try {
      const res = await fetch(
        `http://localhost:8080/api/groups/${selectedGroup}/items/${caseItem.id}`,
        { method: "POST" }
      );

      if (res.ok) {
        alert(`${caseItem.title} added to selected collection!`);
      } else {
        alert("Failed to add to collection.");
      }
    } catch (e) {
      alert("Error adding to collection.");
    }
  };

  const filteredCollections =
    role === "ADMIN"
      ? collections
      : collections.filter((c) => c.ownerId === userId);

  const visibleCases =
    role === "ADMIN"
      ? cases
      : cases.filter(
          (item) =>
            !item.visibility || item.visibility.toUpperCase() === "PUBLIC"
        );

  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <div className="my-cases-page">
      <h1 className="page-title">Case Database</h1>

      <div className="filter-panel">
        <input
          type="text"
          placeholder="Search by case or victim…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <input
          type="text"
          placeholder="Filter by city…"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
          <option value="title">Case Name</option>
          <option value="year">Year</option>
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {(role === "USER" || role === "ADMIN") && (
        <div className="mt-3" style={{ textAlign: "center" }}>
          <label style={{ marginRight: "6px" }}>Add to Collection:</label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">-- Select --</option>
            {filteredCollections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {visibleCases.length === 0 ? (
        <p className="text-center text-muted mt-4">No cases match your filters.</p>
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
                  >
                    {item.title}
                  </a>
                </div>

                <div>{item.victimName || "—"}</div>
                <div>{loc}</div>
                <div>{item.year || "—"}</div>
                <div>
                  <span className={`status-badge status-${item.status?.toLowerCase()}`}>
                    {(item.status || "UNKNOWN").toUpperCase()}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className="btn btn-sm btn-outline-light"
                    onClick={() => addToMyCases(item)}
                  >
                    + My Cases
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => addToCollection(item)}
                  >
                    + Add to Collection
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
