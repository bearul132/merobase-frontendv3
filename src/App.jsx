import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddSample from "./pages/AddSample";
import EditSample from "./pages/EditSample";
import SearchSample from "./pages/SearchSample";
import "leaflet/dist/leaflet.css";

function App() {
  const [samples, setSamples] = useState(() => {
    // 🧩 Load saved samples from localStorage (if available)
    const saved = localStorage.getItem("mero_samples");
    return saved ? JSON.parse(saved) : [];
  });

  // 💾 Sync samples to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("mero_samples", JSON.stringify(samples));
  }, [samples]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={<Dashboard samples={samples} setSamples={setSamples} />}
      />
      <Route
        path="/add-sample"
        element={<AddSample setSamples={setSamples} />}
      />
      <Route
        path="/edit-sample"
        element={<EditSample samples={samples} setSamples={setSamples} />}
      />
      <Route
        path="/search"
        element={<SearchSample samples={samples} setSamples={setSamples} />}
      />
    </Routes>
  );
}

export default App;
