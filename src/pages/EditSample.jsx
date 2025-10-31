import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { OpenStreetMapProvider } from "leaflet-geosearch";

export default function EditSample({ samples, setSamples }) {
  const navigate = useNavigate();
  const [selectedSampleID, setSelectedSampleID] = useState("");
  const [formData, setFormData] = useState({});
  const [photoPreviews, setPhotoPreviews] = useState({});
  const [markerPosition, setMarkerPosition] = useState(null);
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

  // Load selected sample data
  useEffect(() => {
    if (!selectedSampleID) return;
    const sample = samples.find((s) => s.sampleID === selectedSampleID);
    if (sample) {
      const cloned = {
        ...sample,
        projectType: sample.projectType || sample.project || "",
        collectionDate:
          sample.collectionDate && !isNaN(Date.parse(sample.collectionDate))
            ? new Date(sample.collectionDate).toISOString().split("T")[0]
            : "",
      };

      setFormData(cloned);
      setMarkerPosition({
        lat: parseFloat(cloned.latitude) || -8.5,
        lng: parseFloat(cloned.longitude) || 115.5,
      });

      setPhotoPreviews({
        samplePhoto: typeof cloned.samplePhoto === "string" ? cloned.samplePhoto : "",
        semPhoto: typeof cloned.semPhoto === "string" ? cloned.semPhoto : "",
        isolatedPhoto: typeof cloned.isolatedPhoto === "string" ? cloned.isolatedPhoto : "",
      });
    }
  }, [selectedSampleID, samples]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" && value !== "" ? parseFloat(value) : value,
    }));
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, [field]: file }));
    setPhotoPreviews((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
  };

  const handleSearch = async (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const results = await provider.search({ query: e.target.value });
    if (!results.length) return;

    const { x, y } = results[0];
    const newPos = { lat: y, lng: x };
    setMarkerPosition(newPos);
    setFormData((prev) => ({ ...prev, latitude: y.toFixed(6), longitude: x.toFixed(6) }));
    if (mapRef.current) mapRef.current.setView(newPos, 12);
  };

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

  const generateSampleID = () => {
    const { projectType, projectNumber, sampleNumber, semPhoto, isolatedPhoto } = formData;
    if (!projectType || !projectNumber || !sampleNumber) return "";
    const suffixes = [];
    if (semPhoto) suffixes.push("SEM");
    if (isolatedPhoto) suffixes.push("ISO");
    const suffix = suffixes.length ? "-" + suffixes.join("-") : "";
    return `${projectType}${projectNumber}-${sampleNumber}${suffix}`;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedSampleID) return;

    const formattedDate = formData.collectionDate
      ? new Date(formData.collectionDate).toISOString().split("T")[0]
      : "";

    const updatedSamples = samples.map((s) => {
      if (s.sampleID === selectedSampleID) {
        return {
          ...s,
          ...formData,
          sampleID: generateSampleID(),
          collectionDate: formattedDate,
          lastUpdated: new Date().toISOString(),
          latitude: parseFloat(formData.latitude) || s.latitude,
          longitude: parseFloat(formData.longitude) || s.longitude,
          kingdom: formData.kingdom || s.kingdom,
          projectType: formData.projectType || s.projectType,
        };
      }
      return s;
    });

    setSamples(updatedSamples);
    localStorage.setItem("mero_samples", JSON.stringify(updatedSamples));

    alert("✅ Sample successfully updated!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6F0FF] to-[#BFD7FF] p-8">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-12">
        <h1 className="text-4xl font-bold text-[#003366] mb-10 text-center">
          Edit Sample
        </h1>

        {/* Select Sample */}
        <div className="mb-8">
          <label className="block text-[#003366] font-semibold mb-2">
            Select Sample to Edit
          </label>
          <select
            value={selectedSampleID}
            onChange={(e) => setSelectedSampleID(e.target.value)}
            className="input-field"
          >
            <option value="">-- Choose Sample --</option>
            {samples.map((s) => (
              <option key={s.sampleID} value={s.sampleID}>
                {s.sampleID} - {s.sampleName}
              </option>
            ))}
          </select>
        </div>

        {/* Form */}
        {selectedSampleID && (
          <form onSubmit={handleSave} className="space-y-10">
            {/* Photos */}
            <section className="grid md:grid-cols-3 gap-6">
              {["samplePhoto", "semPhoto", "isolatedPhoto"].map((field) => (
                <div
                  key={field}
                  className="flex flex-col items-center border-2 border-dashed border-[#003366]/30 rounded-2xl p-4 hover:border-[#003366] transition"
                >
                  <label className="text-[#003366] font-semibold mb-2 text-center">
                    {field === "samplePhoto"
                      ? "Sample Photo"
                      : field === "semPhoto"
                      ? "SEM Photo"
                      : "Isolated Photo"}
                  </label>
                  {photoPreviews[field] ? (
                    <img
                      src={photoPreviews[field]}
                      alt={field}
                      className="w-44 h-44 object-cover rounded-lg shadow-md mb-3"
                    />
                  ) : (
                    <div className="w-44 h-44 bg-gray-200/60 rounded-lg flex items-center justify-center text-gray-500 text-sm mb-3">
                      No image
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, field)}
                    className="text-sm"
                  />
                </div>
              ))}
            </section>

            {/* Details */}
            <section className="grid md:grid-cols-2 gap-6">
              <input
                placeholder="Sample Name"
                name="sampleName"
                value={formData.sampleName || ""}
                onChange={handleChange}
                className="input-field"
                required
              />
              <input
                type="date"
                name="collectionDate"
                value={formData.collectionDate || ""}
                onChange={handleChange}
                className="input-field"
                required
              />
              <input
                placeholder="Species"
                name="species"
                value={formData.species || ""}
                onChange={handleChange}
                className="input-field"
              />
              <input
                placeholder="Genus"
                name="genus"
                value={formData.genus || ""}
                onChange={handleChange}
                className="input-field"
              />
              <input
                placeholder="Family"
                name="family"
                value={formData.family || ""}
                onChange={handleChange}
                className="input-field"
              />
              <select
                name="kingdom"
                value={formData.kingdom || ""}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select Kingdom</option>
                {kingdoms.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
              <select
                name="projectType"
                value={formData.projectType || ""}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Project Type</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
              <input
                type="number"
                placeholder="Project Number"
                name="projectNumber"
                value={formData.projectNumber || ""}
                onChange={handleChange}
                className="input-field"
              />
              <input
                type="number"
                placeholder="Sample Number"
                name="sampleNumber"
                value={formData.sampleNumber || ""}
                onChange={handleChange}
                className="input-field"
              />
            </section>

            {/* Map */}
            <section>
              <label className="block text-[#003366] font-semibold mb-3">
                Sampling Location
              </label>
              <input
                type="text"
                placeholder="Search location and press Enter"
                onKeyDown={handleSearch}
                className="input-field mb-4"
              />
              <div className="h-96 rounded-xl overflow-hidden shadow-md mb-4">
                <MapContainer
                  center={markerPosition || { lat: -8.5, lng: 115.5 }}
                  zoom={9}
                  style={{ height: "100%", width: "100%" }}
                  whenCreated={(map) => (mapRef.current = map)}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker />
                </MapContainer>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Latitude"
                  name="latitude"
                  value={formData.latitude || ""}
                  onChange={handleChange}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Longitude"
                  name="longitude"
                  value={formData.longitude || ""}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </section>

            {/* Save */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="px-10 py-3 bg-[#003366] text-white font-semibold rounded-xl shadow-md hover:bg-[#004C99] transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 0.5rem 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 0.75rem;
          outline: none;
          transition: all 0.2s;
        }
        .input-field:focus {
          border-color: #0066cc;
          box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
        }
      `}</style>
    </div>
  );
}
