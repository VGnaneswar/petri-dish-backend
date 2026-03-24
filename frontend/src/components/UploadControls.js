import React, { useRef, useState } from "react";

const UploadControls = ({ handleImageUpload }) => {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  return (
    <section
      className={`controls ${dragActive ? "drag-active" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      <h2>Upload Image</h2>
      <p>Drag & drop or click to upload a Petri dish image</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleImageUpload}
      />

      <div
        className="upload-btn"
        onClick={() => inputRef.current.click()}
      >
        ⤴️ Upload Image
      </div>
    </section>
  );
};

export default UploadControls;