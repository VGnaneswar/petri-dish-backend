

import React, { useState } from "react";
import HistoryModal from "./HistoryModal";

function HistoryTable({ history }) {
  const [selected, setSelected] = useState(null);

  const formatConfidence = (conf) =>
    conf !== null && conf !== undefined
      ? (conf * 100).toFixed(1) + "%"
      : "—";

  const formatTime = (isoString) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="history-section">
      <h2>Detection History</h2>

      {history.length === 0 ? (
        <p>No history available.</p>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Filename</th>
              <th>Result</th>
              <th>Upload Time</th>
            </tr>
          </thead>

          <tbody>
            {history.map((item) => (
              <tr
                key={item.id}
                onClick={() => setSelected(item)}
                style={{ cursor: "pointer" }}
              >
                <td>{item.id}</td>

                <td>
                  {item.output_image_url ? (
                    <img
                      src={item.output_image_url}
                      alt="Output"
                      style={{
                        maxWidth: "70px",
                        maxHeight: "70px",
                        borderRadius: "6px",
                      }}
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>

                <td>{item.filename}</td>

                <td>
                  <div style={{ fontSize: "0.9rem" }}>
                    <div>
                      <strong>{item.type?.toUpperCase()}</strong>
                    </div>

                    <div>
                      {item.type === "streak" ? (
                        item.bacteria || "N/A"
                      ) : (
                        `${item.colony_count} colonies`
                      )}
                    </div>

                    <div style={{ color: "#666" }}>
                      {formatConfidence(item.confidence)}
                    </div>
                  </div>
                </td>

                <td>{formatTime(item.upload_time)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selected && (
        <HistoryModal
          item={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

export default HistoryTable;