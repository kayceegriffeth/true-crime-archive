import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserRole } from "../UserRoleContext";

export default function MyCollectionsPage() {
  const { role, userId } = useUserRole();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    visibility: "PRIVATE",
  });

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchGroups = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (debouncedSearch) params.append("keyword", debouncedSearch);

      const res = await fetch(
        `http://localhost:8080/api/groups/search?${params.toString()}`
      );
      if (!res.ok) throw new Error("HTTP " + res.status);

      const data = await res.json();
      const content = Array.isArray(data) ? data : data.content || [];

      const filtered = content;

      const sorted = [...filtered].sort((a, b) => {
        let A = a[sortField] ? a[sortField].toString().toLowerCase() : "";
        let B = b[sortField] ? b[sortField].toString().toLowerCase() : "";

        if (A < B) return sortOrder === "asc" ? -1 : 1;
        if (A > B) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });

      setGroups(sorted);
      setError(null);
    } catch (err) {
      console.error("Fetch groups failed:", err);
      setError("Failed to load collections.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [debouncedSearch, sortField, sortOrder]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newGroup,
          visibility: newGroup.visibility.toUpperCase(),
        }),
      });

      if (!res.ok) {
        alert("Failed to create collection: " + res.status);
        return;
      }

      alert("New collection created!");
      setShowForm(false);
      setNewGroup({ name: "", description: "", visibility: "PRIVATE" });
      fetchGroups();
    } catch (err) {
      console.error("Create group failed:", err);
      alert("Create failed: " + err.message);
    }
  };

  const handleDeleteGroup = async (id, name, ownerId) => {
    if (role !== "ADMIN" && ownerId !== userId) {
      alert("You cannot delete a collection you do not own.");
      return;
    }

    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`http://localhost:8080/api/groups/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Delete failed: " + res.status);
        return;
      }

      alert(`"${name}" deleted.`);
      setGroups((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error("Delete group failed:", err);
      alert("Delete failed: " + err.message);
    }
  };

  return (
    <div className="database-page">
      <h1 className="page-title">Collections</h1>

      <div className="filter-panel">
        <input
          type="text"
          placeholder="Search collections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
          <option value="name">Name</option>
          <option value="createdAt">Created</option>
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="collections-header text-center mt-4 mb-4">
        <button
          className="btn btn-outline-danger"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ New Collection"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreateGroup}
          className="card p-4 mb-5 mx-auto"
          style={{ maxWidth: "500px" }}
        >
          <div className="mb-3">
            <label className="form-label fw-semibold">Name</label>
            <input
              required
              className="form-control"
              value={newGroup.name}
              onChange={(e) =>
                setNewGroup({ ...newGroup, name: e.target.value })
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              className="form-control"
              value={newGroup.description}
              onChange={(e) =>
                setNewGroup({ ...newGroup, description: e.target.value })
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Visibility</label>
            <select
              className="form-select"
              value={newGroup.visibility}
              onChange={(e) =>
                setNewGroup({ ...newGroup, visibility: e.target.value })
              }
            >
              <option value="PRIVATE">Private</option>
              <option value="PUBLIC">Public</option>
            </select>
          </div>

          <button className="btn btn-danger w-100">Create Collection</button>
        </form>
      )}

      {loading && <p className="text-center mt-4">Loading collections…</p>}
      {error && <p className="text-center text-danger mt-4">{error}</p>}

      {!loading && !error && (
        <>
          {groups.length === 0 ? (
            <p className="text-center text-secondary">No collections found.</p>
          ) : (
            <div className="collection-grid">
              {groups.map((g) => (
                <div key={g.id} className="collection-card">
                  <div className="collection-card-body">
                    <h5>
                      {g.name}
                      <span
                        className={`badge ms-2 ${
                          g.visibility === "PUBLIC"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {g.visibility}
                      </span>
                    </h5>

                    <p>{g.description || "No description provided."}</p>

                    <div className="collection-card-actions">
                      <Link to={`/collections/${g.id}`}>
                        <button className="btn-view">View →</button>
                      </Link>

                      {(role === "ADMIN" || g.ownerId === userId) && (
                        <button
                          className="btn-delete"
                          onClick={() =>
                            handleDeleteGroup(g.id, g.name, g.ownerId)
                          }
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
