import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserRole } from "../UserRoleContext";

export default function MyCollectionsPage() {
  const { role } = useUserRole();

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

  const fetchGroups = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      // Optional search
      if (searchTerm) params.append("q", searchTerm);

      // Sorting
      params.append("sort", sortField);
      params.append("order", sortOrder);

      // Visibility rules
      // ADMIN → sees everything (no filter)
      // USER → only public (backend ALSO enforces private rules for users)
      if (role !== "ADMIN") {
        params.append("visibility", "PUBLIC");
      }

      const endpoint = `http://localhost:8080/api/groups/search?${params.toString()}`;

      const response = await fetch(endpoint);
      const data = await response.json();

      const content = Array.isArray(data) ? data : data.content || [];
      setGroups(content);
    } catch (err) {
      setError("Failed to load collections.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [role]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8080/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newGroup,
        visibility: newGroup.visibility.toUpperCase(),
      }),
    });

    if (response.ok) {
      alert("New collection created!");
      setShowForm(false);
      setNewGroup({ name: "", description: "", visibility: "PRIVATE" });
      fetchGroups();
    }
  };

  const handleDeleteGroup = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;

    const response = await fetch(`http://localhost:8080/api/groups/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert(`"${name}" deleted.`);
      setGroups((prev) => prev.filter((g) => g.id !== id));
    }
  };

  return (
    <div className="database-page">
      <h1 className="page-title">Collections</h1>

      {/* Search + sort */}
      <div className="filter-panel">
        <input
          type="text"
          placeholder="Search collections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="createdAt">Created</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        <button className="btn-apply" onClick={fetchGroups}>
          Apply
        </button>
      </div>

      {/* Create button — ADMIN ONLY */}
      {role === "ADMIN" && (
        <div className="collections-header text-center mt-4 mb-4">
          <button
            className="btn btn-outline-danger"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "+ New Collection"}
          </button>
        </div>
      )}

      {/* Form */}
      {showForm && role === "ADMIN" && (
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

        {/* List */}
      {groups.length === 0 ? (
        <p className="text-center text-secondary">No collections found.</p>
      ) : (
        <div className="collection-grid">
          {(role === "ADMIN"
            ? groups
            : groups.filter((g) => g.visibility === "PUBLIC")
          ).map((g) => (
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

                  {role === "ADMIN" && (
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteGroup(g.id, g.name)}
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
    </div>
  );
}
