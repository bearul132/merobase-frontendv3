import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddSample from "./pages/AddSample";
import EditSample from "./pages/EditSample";
import SearchSample from "./pages/SearchSample";
import SampleDetails from "./pages/SampleDetails";
import "leaflet/dist/leaflet.css";

function App() {
  // Load samples from localStorage or initialize empty
  const [samples, setSamples] = useState(() => {
    const saved = localStorage.getItem("mero_samples");
    return saved ? JSON.parse(saved) : [];
  });

  // Keep localStorage in sync whenever samples change
  useEffect(() => {
    localStorage.setItem("mero_samples", JSON.stringify(samples));
  }, [samples]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={<Dashboard samples={samples} setSamples={setSamples} />}
      />

      {/* Add Sample */}
      <Route
        path="/add-sample"
        element={<AddSample samples={samples} setSamples={setSamples} />}
      />

      {/* Edit Sample */}
      <Route
        path="/edit-sample"
        element={<EditSample samples={samples} setSamples={setSamples} />}
      />

      {/* Search Sample */}
      <Route
        path="/search"
        element={<SearchSample samples={samples} setSamples={setSamples} />}
      />

      {/* Sample Details */}
      <Route
        path="/sample/:id"
        element={<SampleDetails samples={samples} />}
      />
    </Routes>
  );
}

export default App;
