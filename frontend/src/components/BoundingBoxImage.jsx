import React, { useRef, useState } from "react";

const BoundingBoxImage = ({ imageUrl, detections }) => {
  const imgRef = useRef(null);
  const [dimensions, setDimensions] = useState(null);

  const onLoad = () => {
    const img = imgRef.current;
    setDimensions({
      width: img.clientWidth,
      height: img.clientHeight,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
    });
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <img
        ref={imgRef}
        src={imageUrl}
        alt="Detected"
        onLoad={onLoad}
        style={{ maxWidth: "100%", borderRadius: "8px" }}
      />

      {dimensions &&
        detections.map((det, idx) => {
          const scaleX = dimensions.width / dimensions.naturalWidth;
          const scaleY = dimensions.height / dimensions.naturalHeight;

          const left = det.bbox[0] * scaleX;
          const top = det.bbox[1] * scaleY;
          const width = (det.bbox[2] - det.bbox[0]) * scaleX;
          const height = (det.bbox[3] - det.bbox[1]) * scaleY;

          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                left,
                top,
                width,
                height,
                border: "2px solid red",
                boxSizing: "border-box",
              }}
              title={`${det.class_name} (${(det.confidence * 100).toFixed(1)}%)`}
            />
          );
        })}
    </div>
  );
};

export default BoundingBoxImage;
