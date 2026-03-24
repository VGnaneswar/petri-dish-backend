import React from "react";

const AnalyticsPanel = ({ history }) => {
  if (!history.length) return null;

  const total = history.length;

  const avgConfidence =
    history.reduce((acc, item) => acc + (item.confidence || 0), 0) / total;

  const totalColonies = history.reduce(
    (acc, item) => acc + (item.colony_count || 0),
    0
  );

  return (
    <div className="analytics-panel">
      <h2>Analytics Overview</h2>

      <div className="analytics-grid">
        <div className="stat-card">
          <h3>{total}</h3>
          <p>Total Uploads</p>
        </div>

        <div className="stat-card">
          <h3>{(avgConfidence * 100).toFixed(1)}%</h3>
          <p>Avg Confidence</p>
        </div>

        <div className="stat-card">
          <h3>{totalColonies}</h3>
          <p>Total Colonies</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;