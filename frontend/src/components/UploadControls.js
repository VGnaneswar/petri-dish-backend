import React from "react";

const UploadControls = ({ handleImageUpload }) => (
  <section className="controls">
    <h2>Upload Image</h2>
    <p>Select a Petri dish image to process colonies.</p>

    <label className="upload-label">
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />
      <div className="upload-btn">
        <span role="img" aria-label="upload">⤴️</span> Upload Image
      </div>
    </label>
  </section>
);

export default UploadControls;
