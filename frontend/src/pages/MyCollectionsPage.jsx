import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MyCollectionsPage() {
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

  async function fetchGroups() {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        keyword: searchTerm,
        sortBy: sortField,
        order: sortOrder,
      });
      const response = await fetch(`http://localhost:8080/api/groups/search?${params}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      const content = Array.isArray(data) ? data : data.content || [];
      setGroups(content);
    } catch (err) {
      console.error("Error fetching groups:", err);
      setError("Failed to load collections.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newGroup,
          visibility: newGroup.visibility.toUpperCase(),
        }),
      });
      if (!response.ok) throw new Error("Failed to create collection");
      alert("New collection created!");
      setShowForm(false);
      setNewGroup({ name: "", description: "", visibility: "PRIVATE" });
      await fetchGroups();
    } catch (err) {
      console.error("Error creating collection:", err);
      alert("Failed to create collection.");
    }
  };

  const handleDeleteGroup = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const response = await fetch(`http://localhost:8080/api/groups/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`Failed to delete collection`);
      alert(`"${name}" deleted successfully.`);
      setGroups((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error("Error deleting collection:", err);
      alert("Something went wrong deleting this collection.");
    }
  };

  return (
    <div className="database-page">
      <h1 className="page-title">Collections</h1>

      {/* 🔍 Search + Sort Controls */}
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search collections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          style={{ marginRight: "10px" }}
        >
          <option value="name">Name</option>
          <option value="createdAt">Created</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <button
          onClick={fetchGroups}
          className="btn btn-sm btn-outline-light"
          style={{ marginLeft: "10px" }}
        >
          Apply
        </button>
      </div>

      {/* New Collection Form */}
      <div className="collections-header text-center mb-4">
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
              type="text"
              className="form-control"
              required
              value={newGroup.name}
              onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
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
          <button type="submit" className="btn btn-danger w-100">
            Create Collection
          </button>
        </form>
      )}

      {/* Collection List */}
      {loading ? (
        <p className="text-center mt-5">Loading collections...</p>
      ) : error ? (
        <p className="text-center text-danger mt-5">{error}</p>
      ) : groups.length === 0 ? (
        <p className="text-center text-secondary mt-5">No collections found.</p>
      ) : (
        <div className="collection-grid">
          {groups.map((g) => (
            <div key={g.id} className="collection-card">
              <div className="collection-card-body">
                <h5>{g.name}</h5>
                <p>{g.description || "No description provided."}</p>
                <div className="collection-card-actions">
                  <Link to={`/collections/${g.id}`}>
                    <button className="btn-view">View →</button>
                  </Link>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteGroup(g.id, g.name)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
