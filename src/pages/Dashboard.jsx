import { useNavigate, useLocation } from "react-router-dom";
import InfoCard from "../components/InfoCard";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 🧭 Fix Leaflet marker icons (for React-Leaflet 5)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Dashboard({ samples = [], setSamples = () => {} }) {
  const navigate = useNavigate();
  const location = useLocation();

  // 🧠 Load from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem("mero_samples");
    if (stored) {
      setSamples(JSON.parse(stored));
    }
  }, [setSamples]);

  // 💾 Save whenever samples change
  useEffect(() => {
    if (samples.length > 0) {
      localStorage.setItem("mero_samples", JSON.stringify(samples));
    }
  }, [samples]);

  // 🧩 Add new sample from AddSample redirect
  useEffect(() => {
    if (location.state?.newSample) {
      setSamples((prev) => {
        const updated = [...prev, location.state.newSample];
        localStorage.setItem("mero_samples", JSON.stringify(updated));
        return updated;
      });
      alert("✅ New sample added successfully!");
      window.history.replaceState({}, document.title);
    }
  }, [location.state, setSamples]);

  const latestRegistered =
    samples.length > 0
      ? samples[samples.length - 1]
      : {
          id: "MB-001",
          name: "Sample Coral A",
          species: "Acropora tenuis",
          date: "2025-10-10",
          location: "N/A",
        };

  const latestEdited =
    samples.length > 1 ? samples[samples.length - 2] : latestRegistered;

  const handleSignOut = () => {
    navigate("/login");
  };

  // 🗺️ Convert string location to lat/lng
  const parsedSamples = samples
    .map((s) => {
      if (s.location && typeof s.location === "string") {
        const [lat, lng] = s.location.split(",").map((n) => parseFloat(n.trim()));
        return { ...s, latitude: lat, longitude: lng };
      }
      return s;
    })
    .filter((s) => !isNaN(s.latitude) && !isNaN(s.longitude));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          MEROBase Dashboard
        </h1>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => navigate("/add-sample")}
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Add New Sample
          </button>

          <button
            onClick={() => navigate("/edit-sample")}
            className="bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition font-semibold"
          >
            Edit Sample
          </button>

          <button
            onClick={() => navigate("/search")}
            className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Search Sample
          </button>

          <button
            onClick={handleSignOut}
            className="bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Sign Out
          </button>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <InfoCard
            title="Latest Registered Sample"
            sample={latestRegistered}
            color="from-blue-500 to-blue-400"
          />
          <InfoCard
            title="Latest Edited Sample"
            sample={latestEdited}
            color="from-yellow-500 to-yellow-400"
          />
        </div>

        {/* 🌍 Registered Sample Map */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-blue-700 mb-3 text-center">
            Sample Location Map
          </h2>

          <div className="h-[400px] rounded-lg overflow-hidden shadow-md">
            <MapContainer
              center={[-8.67, 115.45]} // Bali
              zoom={9}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
              />

              {parsedSamples.map((s, i) => (
                <Marker key={i} position={[s.latitude, s.longitude]}>
                  <Popup>
                    <b>{s.name || "Unnamed Sample"}</b>
                    <br />
                    Species: {s.species || "N/A"}
                    <br />
                    Project: {s.projectType || "N/A"}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
