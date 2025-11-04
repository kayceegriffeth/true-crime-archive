import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; 

export default function GroupDetail() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState("title");
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    async function fetchGroup() {
      try {
        const res = await fetch(
          `http://localhost:8080/api/groups/${id}/items?sort=${sortField},${sortDir}`
        );
        if (!res.ok) throw new Error("Group not found");
        const data = await res.json();
        setGroup(data);
      } catch (err) {
        console.error("Error loading group:", err);
        setError("Failed to load this collection.");
      } finally {
        setLoading(false);
      }
    }
    fetchGroup();
  }, [id, sortField, sortDir]); 

  if (loading) return <p className="text-center mt-5">Loading collection...</p>;
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;

  return (
    <div className="container mt-5">
      <Link to="/collections" className="text-decoration-none text-secondary">
        ← Back to My Collections
      </Link>

      <div className="text-center mt-3 mb-4">
        <h1 className="fw-bold">{group?.name || "Collection"}</h1>
        <p className="text-muted">{group?.description}</p>
      </div>

      {/* SortMenu */}
      <div className="d-flex justify-content-center mb-4">
        <SortMenu
          field={sortField}
          dir={sortDir}
          onChange={({ field, dir }) => {
            setSortField(field);
            setSortDir(dir);
          }}
        />
      </div>

      {group.items.length === 0 ? (
        <p className="text-center text-secondary">No cases in this collection.</p>
      ) : (
        <div className="table-responsive shadow-sm">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Victim</th>
                <th>Location</th>
                <th>Year</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {group.items.map((c) => (
                <tr key={c.id}>
                  <td>{c.title}</td>
                  <td>{c.victimName}</td>
                  <td>
                    {c.locationCity}, {c.locationState}
                  </td>
                  <td>{c.year}</td>
                  <td>
                    <span
                      className={
                        "badge " +
                        (c.status === "CLOSED"
                          ? "bg-success"
                          : c.status === "UNSOLVED"
                          ? "bg-warning text-dark"
                          : c.status === "COLD"
                          ? "bg-secondary"
                          : "bg-info")
                      }
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
