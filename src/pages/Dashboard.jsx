import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InfoCard from "../components/InfoCard";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import logo from "../assets/mero.png";

export default function Dashboard({ samples = [], setSamples = () => {} }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date)) return "N/A";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Latest Registered
  const latestRegisteredSamples = [...samples]
    .sort((a, b) => new Date(b.collectionDate || 0) - new Date(a.collectionDate || 0))
    .slice(0, 3);

  // Latest Edited
  const latestEditedSamples = [...samples]
    .sort((a, b) => new Date(b.lastEdited || 0) - new Date(a.lastEdited || 0))
    .slice(0, 3);

  // Map coordinates
  const parsedSamples = samples
    .map((s) => ({
      ...s,
      latitude: parseFloat(s.latitude),
      longitude: parseFloat(s.longitude),
    }))
    .filter((s) => !isNaN(s.latitude) && !isNaN(s.longitude));

  const getMarkerColor = (type) => {
    const t = (type || "").toUpperCase();
    if (t === "A") return "blue";
    if (t === "B") return "green";
    return "purple";
  };

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
              <button onClick={() => navigate("/dashboard")} className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 flex items-center gap-3">
                <span className="text-lg">🏠</span>
                <span className="text-sm font-medium">Dashboard</span>
              </button>
              <button onClick={() => navigate("/add-sample")} className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 flex items-center gap-3">
                <span className="text-lg">➕</span>
                <span className="text-sm font-medium">Add Sample</span>
              </button>
              <button onClick={() => navigate("/edit-sample")} className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 flex items-center gap-3">
                <span className="text-lg">✏️</span>
                <span className="text-sm font-medium">Edit Sample</span>
              </button>
              <button onClick={() => navigate("/search")} className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 flex items-center gap-3">
                <span className="text-lg">🔍</span>
                <span className="text-sm font-medium">Search</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 md:pl-64">
          <header className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen((s) => !s)} className="md:hidden p-2 rounded-md bg-white/80 hover:bg-white text-gray-700 shadow-sm">
                {sidebarOpen ? "✖" : "☰"}
              </button>
              <div>
                <h2 className="text-2xl font-semibold text-[#003366]">Dashboard</h2>
                <p className="text-sm text-gray-500">Overview of registered samples</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => navigate("/add-sample")} className="bg-[#003366] text-white px-4 py-2 rounded-lg shadow-sm hover:bg-[#004C99] transition">
                + Add Sample
              </button>
              <button onClick={() => navigate("/search")} className="bg-white border border-gray-200 px-3 py-2 rounded-lg hover:shadow-sm">
                🔍 Search
              </button>
            </div>
          </header>

          <main className="max-w-7xl mx-auto p-6">
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-[#002B5B]">Latest Registered</h3>
                  <p className="text-sm text-gray-500 mt-1">Newest samples added</p>
                  <div className="mt-4 grid md:grid-cols-3 gap-4">
                    {latestRegisteredSamples.map((s) => (
                      <InfoCard key={s.sampleID} title={s.sampleName || s.sampleID} sample={s} color="from-blue-500 to-blue-400" />
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-[#002B5B]">Sample Location Map</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Click markers to view details</p>
                  <div className="h-80 rounded-lg overflow-hidden border border-gray-200">
                    <MapContainer center={[-8.67, 115.45]} zoom={9} scrollWheelZoom className="h-full w-full">
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
                      {parsedSamples.map((s) => (
                        <CircleMarker key={s.sampleID} center={[s.latitude, s.longitude]} radius={8} color={getMarkerColor(s.projectType)} fillOpacity={0.9}>
                          <Popup>
                            <b>{s.sampleName || s.sampleID}</b>
                            <br />
                            Species: {s.species || "N/A"}
                            <br />
                            Project: {s.projectType || "N/A"}
                            <br />
                            Date: {formatDate(s.collectionDate)}
                            <br />
                            Coordinates: {s.latitude.toFixed(4)}, {s.longitude.toFixed(4)}
                          </Popup>
                        </CircleMarker>
                      ))}
                    </MapContainer>
                  </div>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-[#002B5B]">Latest Edited</h3>
                  <p className="text-sm text-gray-500 mt-1">Recently updated samples</p>
                  <div className="mt-4 grid md:grid-cols-1 gap-4">
                    {latestEditedSamples.map((s) => (
                      <InfoCard key={s.sampleID} title={s.sampleName || s.sampleID} sample={s} color="from-yellow-500 to-yellow-400" />
                    ))}
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
