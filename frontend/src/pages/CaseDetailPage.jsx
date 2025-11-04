import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function CaseDetailPage() {
  const { id } = useParams();
  const [caseItem, setCaseItem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCase() {
      try {
        const res = await fetch(`http://localhost:8080/api/items/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch case #${id}`);
        const data = await res.json();
        setCaseItem(data);
      } catch (err) {
        console.error("Error loading case detail:", err);
        setError("Could not load case details.");
      }
    }
    fetchCase();
  }, [id]);

  if (error) return <p className="text-center text-danger mt-5">{error}</p>;
  if (!caseItem) return <p className="text-center mt-5">Loading case details...</p>;

  return (
    <div className="collection-detail-page">
      <h1 className="page-title">{caseItem.title}</h1>
      <div className="card p-4 mt-3" style={{ maxWidth: "600px", width: "100%" }}>
        <p><strong>Victim:</strong> {caseItem.victim || "—"}</p>
        <p><strong>Location:</strong> {caseItem.location || "—"}</p>
        <p><strong>Year:</strong> {caseItem.year || "—"}</p>
        <p><strong>Status:</strong> {caseItem.status?.toUpperCase() || "UNKNOWN"}</p>
        <div className="text-center mt-4">
          <Link to="/database" className="btn btn-outline-dark">← Back to Database</Link>
        </div>
      </div>
    </div>
  );
}
