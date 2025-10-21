import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import { useNavigate } from "react-router-dom";
import L from "leaflet";

const AddNewSample = ({ setSamples }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    sampleName: "",
    sampleNumber: "",
    projectType: "",
    projectNumber: "",
    kingdom: "",
    genus: "",
    species: "",
    dateAcquired: "",
    location: "",
    semPhoto: null,
    isolatedPhoto: null,
    samplePhoto: null,
  });

  const [sampleId, setSampleId] = useState("");
  const [markerPosition, setMarkerPosition] = useState(null);
  const mapRef = useRef(null);

  // 📍 Map click handling
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        setFormData((prev) => ({
          ...prev,
          location: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        }));
      },
    });
    return markerPosition ? <Marker position={markerPosition}></Marker> : null;
  };

  // 🔍 Search control setup
  const SearchField = () => {
    const map = useMap();
    useEffect(() => {
      const provider = new OpenStreetMapProvider();
      const searchControl = new GeoSearchControl({
        provider,
        style: "bar",
        showMarker: true,
        retainZoomLevel: false,
        animateZoom: true,
        autoClose: true,
        searchLabel: "Search location...",
      });
      map.addControl(searchControl);
      return () => map.removeControl(searchControl);
    }, [map]);
    return null;
  };

  // ⚙️ Auto-generate Sample ID
  useEffect(() => {
    if (formData.projectType && formData.projectNumber && formData.sampleNumber) {
      let id = `${formData.projectType}-${formData.projectNumber}-${formData.sampleNumber}`;
      if (formData.semPhoto) id += "-SEM";
      if (formData.isolatedPhoto) id += "-ISO";
      setSampleId(id);
    } else {
      setSampleId("");
    }
  }, [
    formData.projectType,
    formData.projectNumber,
    formData.sampleNumber,
    formData.semPhoto,
    formData.isolatedPhoto,
  ]);

  // 📝 Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 💾 Submit new sample
  const handleSubmit = (e) => {
    e.preventDefault();

    const newSample = {
  id: sampleId || `MB-${formData.projectNumber}-${formData.sampleNumber}`,
  name: formData.sampleName,
  species: formData.species,
  genus: formData.genus,
  kingdom: formData.kingdom,
  projectType: formData.projectType,
  projectNumber: formData.projectNumber,
  sampleNumber: formData.sampleNumber,
  location: formData.location,
  date: formData.dateAcquired,
  samplePhoto: formData.samplePhoto
    ? URL.createObjectURL(formData.samplePhoto)
    : null,
  semPhoto: formData.semPhoto
    ? URL.createObjectURL(formData.semPhoto)
    : null,
  isolatedPhoto: formData.isolatedPhoto
    ? URL.createObjectURL(formData.isolatedPhoto)
    : null,
};


    // 🧩 Optionally update state directly (if passed from Dashboard)
    if (setSamples) {
      setSamples((prev) => [...prev, newSample]);
    }

    // ✅ Redirect to Dashboard with new sample
    navigate("/dashboard", { state: { newSample } });
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Add New Sample
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {/* Auto Sample ID */}
        <div className="col-span-2 flex flex-col items-start">
          <label className="font-semibold mb-1">
            Sample ID (Auto Generated)
          </label>
          <div
            className={`px-4 py-2 rounded-xl text-white font-mono text-sm ${
              sampleId
                ? "bg-blue-600 shadow-md"
                : "bg-gray-400 shadow-inner opacity-70"
            }`}
          >
            {sampleId || "Auto-generated when fields are complete"}
          </div>
        </div>

        {/* Sample Photo */}
        <div className="col-span-2">
          <label className="font-semibold">Sample Photo</label>
          <input
            type="file"
            name="samplePhoto"
            accept="image/*"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
          {formData.samplePhoto && (
            <img
              src={URL.createObjectURL(formData.samplePhoto)}
              alt="Sample"
              className="mt-2 w-40 h-40 object-cover rounded-xl"
            />
          )}
        </div>

        {/* Sample Name */}
        <div>
          <label className="font-semibold">Sample Name</label>
          <input
            type="text"
            name="sampleName"
            value={formData.sampleName}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Sample Number */}
        <div>
          <label className="font-semibold">Sample Number</label>
          <input
            type="text"
            name="sampleNumber"
            value={formData.sampleNumber}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Project Type */}
        <div>
          <label className="font-semibold">Project Type</label>
          <select
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select Project Type</option>
            <option value="A">Project A</option>
            <option value="B">Project B</option>
          </select>
        </div>

        {/* Project Number */}
        <div>
          <label className="font-semibold">Project Number</label>
          <input
            type="text"
            name="projectNumber"
            value={formData.projectNumber}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Kingdom */}
        <div>
          <label className="font-semibold">Kingdom</label>
          <select
            name="kingdom"
            value={formData.kingdom}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select Kingdom</option>
            <option value="Animalia">Animalia</option>
            <option value="Plantae">Plantae</option>
            <option value="Fungi">Fungi</option>
            <option value="Protista">Protista</option>
            <option value="Monera">Monera</option>
          </select>
        </div>

        {/* Genus */}
        <div>
          <label className="font-semibold">Genus</label>
          <input
            type="text"
            name="genus"
            value={formData.genus}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Species */}
        <div>
          <label className="font-semibold">Species</label>
          <input
            type="text"
            name="species"
            value={formData.species}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Date Acquired */}
        <div>
          <label className="font-semibold">Date Acquired</label>
          <input
            type="date"
            name="dateAcquired"
            value={formData.dateAcquired}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Map Section */}
        <div className="col-span-2">
          <label className="font-semibold">Sampling Location (click or search)</label>
          <MapContainer
            center={[-8.5, 115.5]}
            zoom={9}
            style={{ height: "300px", width: "100%", borderRadius: "10px" }}
            whenCreated={(map) => (mapRef.current = map)}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            />
            <SearchField />
            <LocationMarker />
          </MapContainer>
          {formData.location && (
            <p className="mt-2 text-sm text-gray-600">
              📍 {formData.location}
            </p>
          )}
        </div>

        {/* SEM Photo */}
        <div>
          <label className="font-semibold">SEM Photo</label>
          <input
            type="file"
            name="semPhoto"
            accept="image/*"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
          {formData.semPhoto && (
            <img
              src={URL.createObjectURL(formData.semPhoto)}
              alt="SEM"
              className="mt-2 w-40 h-40 object-cover rounded-xl"
            />
          )}
        </div>

        {/* Isolated Photo */}
        <div>
          <label className="font-semibold">Isolated Photo</label>
          <input
            type="file"
            name="isolatedPhoto"
            accept="image/*"
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
          {formData.isolatedPhoto && (
            <img
              src={URL.createObjectURL(formData.isolatedPhoto)}
              alt="Isolated"
              className="mt-2 w-40 h-40 object-cover rounded-xl"
            />
          )}
        </div>

        {/* Submit */}
        <div className="col-span-2 text-center mt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow"
          >
            Add Sample
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewSample;
