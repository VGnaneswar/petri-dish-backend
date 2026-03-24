import React from "react";

const OutputImageBox = ({ outputImage, loading }) => (
  <section className="image-section">
    <h2>Output Image</h2>
    <div className="image-box">
      {loading ? (
        <div className="placeholder">
          <img
            src="/Search.gif"
            alt="Loading..."
            style={{ width: "240px", height: "240px" }}
          />
        
        </div>
      ) : outputImage ? (
        <img src={outputImage} alt="Output" className="petri-img" />
      ) : (
        <div className="placeholder">
          
          <p>The processed output image will appear here.</p>
        </div>
      )}
    </div>
  </section>
);

export default OutputImageBox;
