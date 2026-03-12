import React from "react";

function ColonyCountBox({ count, type, bacteria, confidence }) {
  if (!type) return null;

  const formattedConfidence =
    confidence !== null && confidence !== undefined
      ? (confidence * 100).toFixed(2) + "%"
      : "N/A";

  const colonies =
    type === "streak" ? "Not Applicable" : count ?? "—";

  return (
    <div className="colony-count-box">
      <h2>Analysis Result</h2>

      <p>
        <strong>Plate Type:</strong> {type.toUpperCase()}
      </p>

      <p>
        <strong>Detected Bacteria:</strong> {bacteria || "N/A"}
      </p>

      <p>
        <strong>Average Confidence:</strong> {formattedConfidence}
      </p>

      <p>
        <strong>Detected Colonies:</strong> {colonies}
      </p>
    </div>
  );
}

export default ColonyCountBox;