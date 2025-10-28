import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import InfoCard from "../components/InfoCard";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import logo from "../assets/mero.png";

/* Fix Leaflet marker icons */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Dashboard({ samples = [], setSamples = () => {} }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("mero_samples");
    if (stored) {
      try {
        setSamples(JSON.parse(stored));
      } catch {}
    }
  }, [setSamples]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("mero_samples", JSON.stringify(samples));
  }, [samples]);

  // Handle new sample from AddSample redirect
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

  // Get latest 3 registered and edited samples
  const latestRegisteredSamples = samples.slice(-3).reverse();
  const latestEditedSamples =
    samples.length > 1 ? samples.slice(-4, -1).reverse() : latestRegisteredSamples;

  // Parse lat/lng for map markers
  const parsedSamples = samples
    .map((s) => {
      if (s.latitude && s.longitude) {
        return {
          ...s,
          latitude: parseFloat(s.latitude),
          longitude: parseFloat(s.longitude),
        };
      }
      return s;
    })
    .filter((s) => !isNaN(s.latitude) && !isNaN(s.longitude));

  const handleSignOut = () => navigate("/login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800 font-sans">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white/95 backdrop-blur-md border-r border-gray-200 shadow-lg transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:shadow-none`}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
              <img src={logo} alt="MERO" className="w-10 h-10 object-contain" />
              <div>
                <h3 className="text-lg font-semibold text-[#003366]">MEROBase</h3>
                <p className="text-xs text-gray-500">Marine Ecology Repository</p>
              </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 flex items-center gap-3"
              >
                <span className="text-lg">🏠</span>
                <span className="text-sm font-medium">Dashboard</span>
              </button>
              <button
                onClick={() => navigate("/add-sample")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 flex items-center gap-3"
              >
                <span className="text-lg">➕</span>
                <span className="text-sm font-medium">Add Sample</span>
              </button>
              <button
                onClick={() => navigate("/edit-sample")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 flex items-center gap-3"
              >
                <span className="text-lg">✏️</span>
                <span className="text-sm font-medium">Edit Sample</span>
              </button>
              <button
                onClick={() => navigate("/search")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 flex items-center gap-3"
              >
                <span className="text-lg">🔍</span>
                <span className="text-sm font-medium">Search</span>
              </button>
            </nav>

            <div className="px-4 py-4 border-t border-gray-100">
              <button
                onClick={handleSignOut}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium"
              >
                🚪 Sign Out
              </button>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <button
            aria-hidden="true"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/30 md:hidden"
          />
        )}

        <div className="flex-1 md:pl-64">
          {/* Top bar */}
          <header className="flex items-center justify-between px-6 py-4 border-b border-transparent md:border-b-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen((s) => !s)}
                className="md:hidden p-2 rounded-md bg-white/80 hover:bg-white text-gray-700 shadow-sm"
                aria-label="Toggle menu"
              >
                {sidebarOpen ? "✖" : "☰"}
              </button>
              <div>
                <h2 className="text-2xl font-semibold text-[#003366]">Dashboard</h2>
                <p className="text-sm text-gray-500">Overview of registered samples</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => navigate("/add-sample")}
                className="bg-[#003366] text-white px-4 py-2 rounded-lg shadow-sm hover:bg-[#004C99] transition"
              >
                + Add Sample
              </button>
              <button
                onClick={() => navigate("/search")}
                className="bg-white border border-gray-200 px-3 py-2 rounded-lg hover:shadow-sm"
              >
                🔍 Search
              </button>
            </div>
          </header>

          {/* Main container */}
          <main className="max-w-7xl mx-auto p-6">
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                {/* Latest Registered */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-[#002B5B]">Latest Registered</h3>
                  <p className="text-sm text-gray-500 mt-1">Newest samples added</p>
                  <div className="mt-4 grid md:grid-cols-3 gap-4">
                    {latestRegisteredSamples.map((s, i) => (
                      <InfoCard
                        key={i}
                        title={s.sampleName || s.sampleID}
                        sample={{
                          ...s,
                          projectType: s.projectType,
                          projectNumber: s.projectNumber,
                          sampleNumber: s.sampleNumber,
                          species: s.species,
                          genus: s.genus,
                          family: s.family,
                          kingdom: s.kingdom,
                          latitude: s.latitude,
                          longitude: s.longitude,
                          samplePhoto: s.samplePhoto,
                          semPhoto: s.semPhoto,
                          isolatedPhoto: s.isolatedPhoto,
                          date: s.date || "N/A",
                        }}
                        color="from-blue-500 to-blue-400"
                      />
                    ))}
                  </div>
                </div>

                {/* Sample Map */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-[#002B5B]">Sample Location Map</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Click markers to view details</p>
                  <div className="h-80 rounded-lg overflow-hidden border border-gray-200">
                    <MapContainer
                      center={[-8.67, 115.45]}
                      zoom={9}
                      scrollWheelZoom={true}
                      className="h-full w-full"
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="© OpenStreetMap contributors"
                      />
                      {parsedSamples.map((s, i) => (
                        <Marker key={i} position={[s.latitude, s.longitude]}>
                          <Popup>
                            <b>{s.sampleName || s.sampleID}</b>
                            <br />
                            Species: {s.species || "N/A"}
                            <br />
                            Project Type: {s.projectType || "N/A"}
                            <br />
                            Project #: {s.projectNumber || "N/A"}
                            <br />
                            Sample #: {s.sampleNumber || "N/A"}
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <aside className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-[#002B5B]">Latest Edited</h3>
                  <p className="text-sm text-gray-500 mt-1">Recently changed samples</p>
                  <div className="mt-4 grid md:grid-cols-1 gap-4">
                    {latestEditedSamples.map((s, i) => (
                      <InfoCard
                        key={i}
                        title={s.sampleName || s.sampleID}
                        sample={{
                          ...s,
                          projectType: s.projectType,
                          projectNumber: s.projectNumber,
                          sampleNumber: s.sampleNumber,
                          species: s.species,
                          genus: s.genus,
                          family: s.family,
                          kingdom: s.kingdom,
                          latitude: s.latitude,
                          longitude: s.longitude,
                          samplePhoto: s.samplePhoto,
                          semPhoto: s.semPhoto,
                          isolatedPhoto: s.isolatedPhoto,
                          date: s.date || "N/A",
                        }}
                        color="from-yellow-500 to-yellow-400"
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-[#002B5B]">Quick Actions</h3>
                  <div className="mt-3 flex flex-col gap-3">
                    <button onClick={() => navigate("/add-sample")} className="w-full text-left px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100">
                      ➕ Add Sample
                    </button>
                    <button onClick={() => navigate("/edit-sample")} className="w-full text-left px-3 py-2 rounded-lg bg-yellow-50 hover:bg-yellow-100">
                      ✏️ Edit Sample
                    </button>
                    <button onClick={() => navigate("/search")} className="w-full text-left px-3 py-2 rounded-lg bg-green-50 hover:bg-green-100">
                      🔍 Search Samples
                    </button>
                  </div>
                </div>
              </aside>
            </section>

            <footer className="mt-8 text-center text-gray-500 text-sm">
              © 2025 MERO Foundation | Marine Ecology Repository (MEROBase)
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
