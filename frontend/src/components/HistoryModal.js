import React from "react";
import ReactDOM from "react-dom";

function HistoryModal({ item, onClose }) {

  // ✅ DOWNLOAD FUNCTION
  const handleDownload = () => {
    if (!item.output_image_url) return;

    const link = document.createElement("a");
    link.href = item.output_image_url;
    link.download = item.filename || "detected-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formattedConfidence =
    item.confidence !== null && item.confidence !== undefined
      ? (item.confidence * 100).toFixed(2) + "%"
      : "N/A";

  const colonies =
    item.type === "streak"
      ? "Not Applicable"
      : item.colony_count ?? "—";

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content fullscreen-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2>Detection Details</h2>

        {/* ✅ ONLY SHOW IMAGE (NO EXTRA BOXES) */}
        {item.output_image_url && (
          <div className="modal-image-wrapper">
            <img
              src={item.output_image_url}
              alt="Detected Output"
              className="modal-image-full"
            />
          </div>
        )}

        {/* DOWNLOAD BUTTON */}
        {item.output_image_url && (
          <button
            className="download-btn"
            onClick={handleDownload}
          >
            ⬇ Download Image
          </button>
        )}

        {/* DETAILS */}
        <div className="modal-details">
          <p><strong>Filename:</strong> {item.filename}</p>

          <p>
            <strong>Plate Type:</strong>{" "}
            {item.type ? item.type.toUpperCase() : "N/A"}
          </p>

          <p>
            <strong>Detected Bacteria:</strong>{" "}
            {item.bacteria || "N/A"}
          </p>

          <p>
            <strong>Average Confidence:</strong>{" "}
            {formattedConfidence}
          </p>

          <p>
            <strong>Detected Colonies:</strong>{" "}
            {colonies}
          </p>

          <p><strong>Upload Time:</strong> {item.upload_time}</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default HistoryModal;