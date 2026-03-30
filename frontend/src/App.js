// frontend/src/App.js

import React, { useState, useEffect, useMemo } from "react";
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

  // ✅ THEME STATE (NEW)
  const [theme, setTheme] = useState("light");

  const floatingSprites = useMemo(() => {
    const gifPool = [
      "/Bacterium,_Single_cell_organism_20260330172004.gif",
      "/bacterium_20260330172046.gif",
    ];

    const random = (min, max) => Math.random() * (max - min) + min;

    return Array.from({ length: 6 }, (_, i) => {
      const dx = random(22, 48) * (Math.random() > 0.5 ? 1 : -1);
      const dy = random(18, 42) * (Math.random() > 0.5 ? 1 : -1);
      const rot = random(4, 12) * (Math.random() > 0.5 ? 1 : -1);

      return {
        id: `bg-gif-${i}`,
        src: gifPool[Math.floor(Math.random() * gifPool.length)],
        style: {
          "--x": `${random(6, 90).toFixed(1)}%`,
          "--y": `${random(8, 84).toFixed(1)}%`,
          "--size": `${random(56, 86).toFixed(0)}px`,
          "--dur": `${random(10, 16).toFixed(1)}s`,
          "--delay": `${(i * 0.24).toFixed(2)}s`,
          "--dx": `${dx.toFixed(0)}px`,
          "--dy": `${dy.toFixed(0)}px`,
          "--rot": `${rot.toFixed(0)}deg`,
        },
      };
    });
  }, []);

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

  const getFriendlyUploadError = (err) => {
    const detail = err?.response?.data?.detail;
    const message = typeof detail === "string" ? detail : "";

    if (message.includes("File size too large")) {
      return "File is too large. Please upload an image below 10 MB.";
    }

    return detail || "Error uploading or processing image.";
  };

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
        setErrorMsg(getFriendlyUploadError(err));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={`container ${theme}`}>
      <div className="background-gif-layer" aria-hidden="true">
        {floatingSprites.map((sprite) => (
          <img
            key={sprite.id}
            src={sprite.src}
            alt=""
            className="bg-gif"
            style={sprite.style}
          />
        ))}
      </div>

      <header className="header">
        
        {/* LEFT SIDE */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src={require("./bacterial-colony-growth-on-agar.jpg")}
            alt="ColonySight Logo"
            className="logo"
            style={{ width: "100px", height: "100px" }}
          />
          <h1>Detect Bacterial Colonies</h1>
        </div>

        {/* RIGHT SIDE (THEME TOGGLE) */}
        <button
          className="theme-toggle"
          onClick={() =>
            setTheme(theme === "light" ? "dark" : "light")
          }
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </header>

      <div className="main-content">
        <UploadControls handleImageUpload={handleImageUpload} />

        {/* 🔥 ANALYSIS RESULT */}
        <ColonyCountBox
          count={colonyCount}
          type={plateType}
          bacteria={bacteria}
          confidence={confidence}
        />

        <div className="image-section-wrapper">
          <OriginalImageBox image={image} />
          <OutputImageBox outputImage={outputImage} loading={loading} />
        </div>

        {loading && <p className="loading">Processing image...</p>}
        {errorMsg && <p className="error">{errorMsg}</p>}

        <HistoryTable history={history} />
      </div>
    </div>
  );
}

export default App;
