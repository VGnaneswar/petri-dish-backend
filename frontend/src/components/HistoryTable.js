import React, { useState } from "react";
import HistoryModal from "./HistoryModal";

function HistoryTable({ history }) {
  const [selected, setSelected] = useState(null);

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
              <th>Detected Colonies</th>
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
                <td>{item.colony_count ?? "N/A"}</td>
                <td>{item.upload_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selected && (
        <HistoryModal item={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

export default HistoryTable;
