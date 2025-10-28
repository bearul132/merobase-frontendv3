import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddSample from "./pages/AddSample";
import EditSample from "./pages/EditSample";
import SearchSample from "./pages/SearchSample";
import SampleDetails from "./pages/SampleDetails";
import "leaflet/dist/leaflet.css";

function App() {
  // Centralized sample data
  const [samples, setSamples] = useState(() => {
    const stored = localStorage.getItem("mero_samples");
    return stored ? JSON.parse(stored) : [];
  });

  // Persist samples in localStorage
  useEffect(() => {
    localStorage.setItem("mero_samples", JSON.stringify(samples));
  }, [samples]);

  return (
    <Router>
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

        {/* Fallback 404 */}
        <Route
          path="*"
          element={
            <div className="p-8 text-center text-gray-700 text-lg font-medium">
              404 — Page Not Found
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
