import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useUserRole } from "../UserRoleContext";

function pick(obj, keys, fallback = "—") {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
  }
  return fallback;
}

export default function CollectionDetailPage() {
  const { id } = useParams();
  const { role } = useUserRole();     

  const [group, setGroup] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [gRes, iRes] = await Promise.all([
          fetch(`http://localhost:8080/api/groups/${id}`),
          fetch(`http://localhost:8080/api/groups/${id}/items`)
        ]);

        if (!gRes.ok) throw new Error(`Group HTTP ${gRes.status}`);
        if (!iRes.ok) throw new Error(`Items HTTP ${iRes.status}`);

        const gData = await gRes.json();
        const iData = await iRes.json();

        setGroup(gData);
        setItems(Array.isArray(iData) ? iData : iData.content || []);
      } catch (e) {
        console.error("Collection load failed:", e);
        setError("Unable to load this collection.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p className="text-center mt-5">Loading collection...</p>;
  if (error)   return <p className="text-center text-danger mt-5">{error}</p>;
  if (!group)  return <p className="text-center mt-5">Collection not found.</p>;


  if (role !== "ADMIN" && group.visibility === "PRIVATE") {
    return (
      <div className="my-cases-page" style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 className="page-title" style={{ marginTop: 0 }}>Private Collection</h1>
        <p className="text-center text-secondary">
          This collection is private and can only be viewed by its owner or an admin.
        </p>
        <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
          <Link to="/collections" className="btn btn-outline-dark">
            ← Back to Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-cases-page" style={{ maxWidth: 1100, margin: "0 auto" }}>
      <h1 className="page-title" style={{ marginTop: 0 }}>{group.name}</h1>
      {group.description && (
        <p className="text-center text-secondary mb-4" style={{ marginTop: "-8px" }}>
          {group.description}
        </p>
      )}

      {items.length === 0 ? (
        <p className="text-center text-secondary">No cases in this collection yet.</p>
      ) : (
        <div className="my-cases-list">
          <div className="my-cases-header-row">
            <div>Case Name</div>
            <div>Victim</div>
            <div>Location</div>
            <div>Year</div>
            <div>Status</div>
          </div>

          {items.map((item) => {
            const id        = pick(item, ["id"], null);
            const title     = pick(item, ["title", "name"], "Untitled");
            const victim    = pick(item, ["victim", "victimName", "victim_fullname", "victim_name"]);
            const locationCity  = pick(item, ["locationCity", "city"]);
            const locationState = pick(item, ["locationState", "state"]);
            const location =
              locationCity && locationState
                ? `${locationCity}, ${locationState}`
                : locationCity || locationState || "—";
            const year      = pick(item, ["year", "caseYear"]);
            const statusRaw = (pick(item, ["status"], "UNKNOWN") + "").trim();
            const status    = statusRaw.toLowerCase();

            const wikiUrl =
              item.source_url ||
              item.wiki_url ||
              item.link ||
              `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(title)}`;

            return (
              <div key={id ?? title} className="my-case-row">
                <div>
                  <a
                    href={wikiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-title"
                    style={{ color: "#ff4747", textDecoration: "none" }}
                    onClick={(e) => {
                      if (!wikiUrl || wikiUrl === "#") e.preventDefault();
                    }}
                  >
                    {title}
                  </a>
                </div>
                <div>{victim}</div>
                <div>{location}</div>
                <div>{year}</div>
                <div>
                  <span className={`status-badge status-${status}`}>
                    {(statusRaw || "UNKNOWN").toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
        <Link to="/collections" className="btn btn-outline-dark">
          ← Back to Collections
        </Link>
      </div>
    </div>
  );
}
