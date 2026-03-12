import React from "react";

function ColonyCountBox({ count, type, bacteria, confidence }) {
  // 🔵 STREAK ONLY
  if (type === "streak") {
    return (
      <div className="colony-count-box">
        <h2>Streak Growth Detected</h2>
        <p><strong>Bacteria:</strong> {bacteria || "Unknown"}</p>
        <p>
          <strong>Confidence:</strong>{" "}
          {confidence ? (confidence * 100).toFixed(1) + "%" : "—"}
        </p>
      </div>
    );
  }

  // 🟡 MIXED
  if (type === "mixed") {
    return (
      <div className="colony-count-box">
        <h2>Mixed Plate Detected</h2>
        <p><strong>Colonies:</strong> {count ?? "—"}</p>
        <hr />
        <p><strong>Streak Bacteria:</strong> {bacteria || "Unknown"}</p>
        <p>
          <strong>Confidence:</strong>{" "}
          {confidence ? (confidence * 100).toFixed(1) + "%" : "—"}
        </p>
      </div>
    );
  }

  // 🟢 DEFAULT SPREAD
  return (
    <div className="colony-count-box">
      <h2>Detected Colonies</h2>
      <p>{count !== null ? count : "—"}</p>
    </div>
  );
}

export default ColonyCountBox;