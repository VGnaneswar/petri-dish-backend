import React, { useRef, useState } from "react";

function HistoryModal({ item, onClose }) {
  const imgRef = useRef(null);
  const [dims, setDims] = useState(null);

  const handleImageLoad = () => {
    const img = imgRef.current;
    if (!img) return;

    setDims({
      width: img.clientWidth,
      height: img.clientHeight,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
    });
  };

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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2>Detection Details</h2>

        {/* IMAGE + BOXES */}
        {item.output_image_url && (
          <div
            style={{
              position: "relative",
              display: "inline-block",
              maxWidth: "100%",
              overflow: "hidden",
            }}
          >
            <img
              ref={imgRef}
              src={item.output_image_url}
              alt="Detected Output"
              className="modal-image"
              onLoad={handleImageLoad}
              style={{
                display: "block",
                maxWidth: "100%",
                height: "auto",
                borderRadius: "10px",
              }}
            />

            {/* DRAW BOXES */}
            {dims &&
              item.type !== "streak" &&
              item.detections?.map((det, idx) => {
                const scaleX = dims.width / dims.naturalWidth;
                const scaleY = dims.height / dims.naturalHeight;

                const x1 = Math.max(0, det.box[0] * scaleX);
                const y1 = Math.max(0, det.box[1] * scaleY);
                const x2 = Math.min(dims.width, det.box[2] * scaleX);
                const y2 = Math.min(dims.height, det.box[3] * scaleY);

                return (
                  <div
                    key={idx}
                    style={{
                      position: "absolute",
                      left: x1,
                      top: y1,
                      width: x2 - x1,
                      height: y2 - y1,
                      border: "2px solid red",
                      boxSizing: "border-box",
                      pointerEvents: "none",
                    }}
                  />
                );
              })}
          </div>
        )}

        {/* ✅ DOWNLOAD BUTTON */}
        {item.output_image_url && (
          <button
            className="download-btn"
            onClick={handleDownload}
          >
            ⬇ Download Image
          </button>
        )}

        {/* DETAILS */}
        <div className="modal-details" style={{ marginTop: "15px" }}>
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
    </div>
  );
}

export default HistoryModal;