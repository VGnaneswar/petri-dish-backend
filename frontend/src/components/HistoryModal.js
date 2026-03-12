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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2>Detection Details</h2>

        {item.output_image_url && (
          <div style={{ position: "relative", width: "100%" }}>
            <img
              ref={imgRef}
              src={item.output_image_url}
              alt="Detected Output"
              className="modal-image"
              onLoad={handleImageLoad}
            />

            {/* Only draw boxes for spread or mixed */}
            {dims &&
              item.type !== "streak" &&
              item.detections?.map((det, idx) => {
                const scaleX = dims.width / dims.naturalWidth;
                const scaleY = dims.height / dims.naturalHeight;

                const x1 = det.box[0] * scaleX;
                const y1 = det.box[1] * scaleY;
                const x2 = det.box[2] * scaleX;
                const y2 = det.box[3] * scaleY;

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
                    }}
                    title={`${det.class_name} (${(det.confidence * 100).toFixed(1)}%)`}
                  />
                );
              })}
          </div>
        )}

        <div className="modal-details">
          <p><strong>Filename:</strong> {item.filename}</p>

          {item.type === "streak" ? (
            <>
              <p><strong>Plate Type:</strong> Streak</p>
              <p><strong>Bacteria:</strong> {item.bacteria}</p>
              <p>
                <strong>Confidence:</strong>{" "}
                {(item.confidence * 100).toFixed(1)}%
              </p>
            </>
          ) : item.type === "mixed" ? (
            <>
              <p><strong>Plate Type:</strong> Mixed</p>
              <p><strong>Colonies:</strong> {item.colony_count}</p>
              <p><strong>Bacteria:</strong> {item.bacteria}</p>
              <p>
                <strong>Confidence:</strong>{" "}
                {(item.confidence * 100).toFixed(1)}%
              </p>
            </>
          ) : (
            <>
              <p><strong>Plate Type:</strong> Spread</p>
              <p><strong>Colonies:</strong> {item.colony_count}</p>
            </>
          )}

          <p><strong>Upload Time:</strong> {item.upload_time}</p>
        </div>
      </div>
    </div>
  );
}

export default HistoryModal;