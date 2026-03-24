import React, { useState } from "react";

const UploadControls = ({ handleImageUpload }) => {
  const [dragActive, setDragActive] = useState(false);

  return (
    <section
      className={`controls ${dragActive ? "drag-active" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          const fakeEvent = {
            target: { files: e.dataTransfer.files },
          };
          handleImageUpload(fakeEvent);
        }
      }}
    >
      <h2>Upload Image</h2>
      <p>Drag & drop or click to upload a Petri dish image</p>

      <label className="upload-label">
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />

        <div className="upload-area">
          <div className="upload-icon">🧫</div>
          <p className="upload-text">
            {dragActive ? "Drop image here..." : "Click or Drag Image"}
          </p>
        </div>
      </label>
    </section>
  );
};

export default UploadControls;