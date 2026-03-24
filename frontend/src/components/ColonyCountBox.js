import React from "react";

function ColonyCountBox({ count, type, bacteria, confidence }) {
  if (!type) return null;

  const formattedConfidence =
    confidence !== null && confidence !== undefined
      ? (confidence * 100).toFixed(1) + "%"
      : "N/A";

  const colonies =
    type === "streak" ? "N/A" : count ?? "—";

  return (
    <div className="colony-count-box">
      <h2>Analysis Result</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Plate Type</p>
          <h3>{type.toUpperCase()}</h3>
        </div>

        <div className="stat-card">
          <p className="stat-label">Bacteria</p>
          <h3>{bacteria || "N/A"}</h3>
        </div>

        <div className="stat-card">
          <p className="stat-label">Confidence</p>
          <h3>{formattedConfidence}</h3>
        </div>

        <div className="stat-card">
          <p className="stat-label">Colonies</p>
          <h3>{colonies}</h3>
        </div>
      </div>
    </div>
  );
}

export default ColonyCountBox;