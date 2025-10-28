import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import { useNavigate } from "react-router-dom";
import L from "leaflet";

export default function EditSample({ samples = [], setSamples = () => {} }) {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState("");
  const [formData, setFormData] = useState({
    projectType: "",
    projectNumber: "",
    sampleNumber: "",
    sampleID: "",
    sampleName: "",
    species: "",
    genus: "",
    family: "",
    kingdom: "",
    latitude: "",
    longitude: "",
    samplePhoto: "",
    semPhoto: "",
    isolatedPhoto: "",
  });
  const [markerPosition, setMarkerPosition] = useState(null);
  const [photoPreviews, setPhotoPreviews] = useState({});
  const mapRef = useRef(null);
  const provider = new OpenStreetMapProvider();

  const kingdoms = [
    "Animalia",
    "Plantae",
    "Fungi",
    "Protista",
    "Archaea",
    "Bacteria",
    "Chromista",
    "Undecided",
  ];

  // Fix Leaflet default icon
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });

  // Populate form when selecting a sample
  useEffect(() => {
    if (!selectedId) return;

    const sample = samples.find((s) => s.sampleID === selectedId);
    if (sample) {
      setFormData(sample);
      setPhotoPreviews({
        samplePhoto: sample.samplePhoto || "",
        semPhoto: sample.semPhoto || "",
        isolatedPhoto: sample.isolatedPhoto || "",
      });

      if (sample.latitude && sample.longitude) {
        const pos = { lat: parseFloat(sample.latitude), lng: parseFloat(sample.longitude) };
        setMarkerPosition(pos);
        if (mapRef.current) mapRef.current.setView(pos, 12);
      }
    }
  }, [selectedId, samples]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setPhotoPreviews((prev) => ({ ...prev, [name]: URL.createObjectURL(files[0]) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Auto-generate Sample ID
  useEffect(() => {
    const { projectType, projectNumber, sampleNumber, semPhoto, isolatedPhoto } = formData;
    if (projectType && projectNumber && sampleNumber) {
      const suffixes = [];
      if (semPhoto) suffixes.push("SEM");
      if (isolatedPhoto) suffixes.push("ISO");
      const suffix = suffixes.length ? "-" + suffixes.join("-") : "";
      const id = `${projectType}${projectNumber}-${sampleNumber}${suffix}`;
      setFormData((prev) => ({ ...prev, sampleID: id }));
    }
  }, [formData.projectType, formData.projectNumber, formData.sampleNumber, formData.semPhoto, formData.isolatedPhoto]);

  // Map click marker
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setMarkerPosition(e.latlng);
        setFormData((prev) => ({
          ...prev,
          latitude: e.latlng.lat.toFixed(6),
          longitude: e.latlng.lng.toFixed(6),
        }));
      },
    });
    return markerPosition ? <Marker position={markerPosition} /> : null;
  }

  // Map search
  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const results = await provider.search({ query: e.target.value });
      if (results.length > 0) {
        const { x, y } = results[0];
        const newPos = { lat: y, lng: x };
        setMarkerPosition(newPos);
        setFormData((prev) => ({
          ...prev,
          latitude: y.toFixed(6),
          longitude: x.toFixed(6),
        }));
        mapRef.current.setView(newPos, 12);
      }
    }
  };

  // Save edited sample
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedSamples = samples.map((s) =>
      s.sampleID === selectedId
        ? {
            ...s,
            ...formData,
            samplePhoto: formData.samplePhoto instanceof File ? photoPreviews.samplePhoto : formData.samplePhoto,
            semPhoto: formData.semPhoto instanceof File ? photoPreviews.semPhoto : formData.semPhoto,
            isolatedPhoto: formData.isolatedPhoto instanceof File ? photoPreviews.isolatedPhoto : formData.isolatedPhoto,
          }
        : s
    );

    setSamples(updatedSamples);
    localStorage.setItem("mero_samples", JSON.stringify(updatedSamples));
    alert("✅ Sample updated successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6F0FF] to-[#BFD7FF] font-sans text-gray-800 p-8">
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-[#003366] text-center mb-8">Edit Sample</h1>

        {/* Select Sample */}
        <div className="mb-6">
          <label className="block text-[#003366] font-semibold mb-2">Select Sample</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0066CC] outline-none"
          >
            <option value="">-- Choose a sample --</option>
            {samples.map((s) => (
              <option key={s.sampleID} value={s.sampleID}>
                {s.sampleID} — {s.sampleName}
              </option>
            ))}
          </select>
        </div>

        {selectedId && (
          <form onSubmit={handleSubmit} className="space-y-8 overflow-y-auto max-h-[80vh] pr-2">
            {/* Photo Uploads */}
            <div className="grid md:grid-cols-3 gap-6">
              {["samplePhoto", "semPhoto", "isolatedPhoto"].map((field) => (
                <div key={field} className="flex flex-col items-center justify-center border-2 border-dashed border-[#003366]/30 rounded-2xl p-4 hover:border-[#003366] transition">
                  <label className="text-[#003366] font-semibold mb-2">
                    {field === "samplePhoto"
                      ? "Sample Photo"
                      : field === "semPhoto"
                      ? "SEM Photo"
                      : "Isolated Photo"}
                  </label>
                  {photoPreviews[field] ? (
                    <img src={photoPreviews[field]} alt={field} className="w-40 h-40 object-cover rounded-lg shadow-md mb-3" />
                  ) : (
                    <div className="w-40 h-40 bg-gray-200/60 rounded-lg flex items-center justify-center text-gray-500 text-sm mb-3">No image</div>
                  )}
                  <input type="file" accept="image/*" name={field} onChange={handleChange} className="text-sm text-[#003366]" />
                </div>
              ))}
            </div>

            {/* Sample Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#003366] font-semibold mb-2">Project Type</label>
                <select name="projectType" value={formData.projectType} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0066CC] outline-none transition">
                  <option value="">Select Project Type</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
              </div>
              <div>
                <label className="block text-[#003366] font-semibold mb-2">Project Number</label>
                <input type="number" name="projectNumber" value={formData.projectNumber} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0066CC] outline-none transition"/>
              </div>
              <div>
                <label className="block text-[#003366] font-semibold mb-2">Sample Number</label>
                <input type="number" name="sampleNumber" value={formData.sampleNumber} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0066CC] outline-none transition"/>
              </div>
              <div>
                <label className="block text-[#003366] font-semibold mb-2">Sample Name</label>
                <input type="text" name="sampleName" value={formData.sampleName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0066CC] outline-none transition"/>
              </div>
              <div>
                <label className="block text-[#003366] font-semibold mb-2">Species</label>
                <input type="text" name="species" value={formData.species} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0066CC] outline-none transition"/>
              </div>
              <div>
                <label className="block text-[#003366] font-semibold mb-2">Genus</label>
                <input type="text" name="genus" value={formData.genus} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0066CC] outline-none transition"/>
              </div>
              <div>
                <label className="block text-[#003366] font-semibold mb-2">Family</label>
                <input type="text" name="family" value={formData.family} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0066CC] outline-none transition"/>
              </div>
              <div>
                <label className="block text-[#003366] font-semibold mb-2">Kingdom</label>
                <select name="kingdom" value={formData.kingdom} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0066CC] outline-none transition">
                  <option value="">Select Kingdom</option>
                  {kingdoms.map((k) => (<option key={k} value={k}>{k}</option>))}
                </select>
              </div>
            </div>

            {/* Sample ID */}
            <div>
              <label className="block text-[#003366] font-semibold mb-2">Sample ID (Auto)</label>
              <input type="text" value={formData.sampleID} readOnly className="w-full border border-gray-300 bg-gray-100 rounded-lg px-4 py-2 text-gray-600"/>
            </div>

            {/* Map */}
            <div>
              <label className="block text-[#003366] font-semibold mb-3">Sampling Location</label>
              <input type="text" placeholder="Search location and press Enter" onKeyDown={handleSearch} className="w-full mb-4 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0066CC] outline-none transition"/>
              <div className="h-80 rounded-xl overflow-hidden shadow-md">
                <MapContainer center={markerPosition || [-8.5, 115.5]} zoom={9} style={{ height: "100%", width: "100%" }} whenCreated={(map) => (mapRef.current = map)}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                  <LocationMarker />
                </MapContainer>
              </div>
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-[#003366] font-semibold mb-2">Latitude</label>
                  <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0066CC] outline-none transition"/>
                </div>
                <div>
                  <label className="block text-[#003366] font-semibold mb-2">Longitude</label>
                  <input type="text" name="longitude" value={formData.longitude} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0066CC] outline-none transition"/>
                </div>
              </div>
            </div>

            {/* Save */}
            <div className="flex justify-center pt-4">
              <button type="submit" className="px-8 py-3 bg-[#003366] text-white font-semibold rounded-lg shadow-md hover:bg-[#004C99] transition">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
