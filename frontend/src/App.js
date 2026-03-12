// frontend/src/App.js

import React, { useState, useEffect } from "react";
import api from "./axiosMiddleware";
import "./App.css";

import UploadControls from "./components/UploadControls";
import OriginalImageBox from "./components/OriginalImageBox";
import OutputImageBox from "./components/OutputImageBox";
import HistoryTable from "./components/HistoryTable";
import ColonyCountBox from "./components/ColonyCountBox";

function App() {
  const [image, setImage] = useState(null);
  const [outputImage, setOutputImage] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 🔥 NEW STATES
  const [colonyCount, setColonyCount] = useState(null);
  const [plateType, setPlateType] = useState(null);
  const [bacteria, setBacteria] = useState(null);
  const [confidence, setConfidence] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/history");
        setHistory(res.data);
      } catch (err) {
        console.error("Error fetching history:", err);
        setErrorMsg("Failed to fetch history from backend.");
      }
    };
    fetchHistory();
  }, []);

  const handleImageUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(URL.createObjectURL(file));
      setLoading(true);
      setErrorMsg("");
      setOutputImage(null);

      // 🔥 RESET EVERYTHING
      setColonyCount(null);
      setPlateType(null);
      setBacteria(null);
      setConfidence(null);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await api.post("/ingest/petri-dish", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const data = res.data;

        setOutputImage(data.output_image_url);
        setColonyCount(data.colony_count);
        setPlateType(data.type);
        setBacteria(data.bacteria);
        setConfidence(data.confidence);

        const historyRes = await api.get("/history");
        setHistory(historyRes.data);

      } catch (err) {
        console.error("Upload error:", err);
        setErrorMsg("Error uploading or processing image.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container">
      <header className="header">
        <img
          src={require("./bacterial-colony-growth-on-agar.jpg")}
          alt="ColonySight Logo"
          className="logo"
          style={{ width: "120px", height: "120px" }}
        />
        <h1>Detect Bacterial Colonies</h1>
      </header>

      <div className="main-content">
        <UploadControls handleImageUpload={handleImageUpload} />

        <div className="image-section-wrapper">
          <OriginalImageBox image={image} />
          <OutputImageBox outputImage={outputImage} loading={loading} />
        </div>

        {/* 🔥 UPDATED PROPS */}
        <ColonyCountBox
          count={colonyCount}
          type={plateType}
          bacteria={bacteria}
          confidence={confidence}
        />

        {loading && <p className="loading">Processing image...</p>}
        {errorMsg && <p className="error">{errorMsg}</p>}

        <HistoryTable history={history} />
      </div>
    </div>
  );
}

export default App;