// src/components/OriginalImageBox.js
import React from "react";

const OriginalImageBox = ({ image }) => (
  <section className="image-section">
    <h2>Original Image</h2>
    <div className="image-box">
      {image ? (
        <img src={image} alt="Uploaded Petri Dish" className="petri-img" />
      ) : (
        <div className="placeholder">
          <span role="img" aria-label="image">🖼️</span>
          <p>Your uploaded petri dish image will appear here.</p>
        </div>
      )}
    </div>
  </section>
);

export default OriginalImageBox;
