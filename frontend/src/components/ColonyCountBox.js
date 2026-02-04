import React from "react";

function ColonyCountBox({ count }) {
  return (
    <div className="colony-count-box">
      <h2>Detected Colonies</h2>
      <p>{count !== null ? count : "—"}</p>
    </div>
  );
}

export default ColonyCountBox;
  