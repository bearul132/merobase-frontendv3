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

function EditSample({ samples, setSamples }) {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState("");
  const [formData, setFormData] = useState({});
  const [markerPosition, setMarkerPosition] = useState(null);
  const mapRef = useRef(null);

  // Update form when user selects a sample
  useEffect(() => {
    if (selectedId) {
      const found = samples.find((s) => s.id === selectedId);
      if (found) {
        setFormData(found);
        if (found.location) {
          const [lat, lng] = found.location.split(",").map(Number);
          setMarkerPosition([lat, lng]);
        }
      }
    }
  }, [selectedId, samples]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

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

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedId) return alert("Please select a sample to edit");

    const updated = samples.map((s) =>
      s.id === selectedId
        ? {
            ...formData,
            samplePhoto: formData.samplePhoto
              ? URL.createObjectURL(formData.samplePhoto)
              : s.samplePhoto,
            semPhoto: formData.semPhoto
              ? URL.createObjectURL(formData.semPhoto)
              : s.semPhoto,
            isolatedPhoto: formData.isolatedPhoto
              ? URL.createObjectURL(formData.isolatedPhoto)
              : s.isolatedPhoto,
          }
        : s
    );

    setSamples(updated);
    alert("✅ Sample updated successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Edit Sample
      </h2>

      {/* Dropdown for sample selection */}
      <div className="mb-6">
        <label className="font-semibold mb-1 block">Select Sample to Edit</label>
        <select
          className="w-full border rounded-lg p-2"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">-- Choose a Sample --</option>
          {samples.map((s, index) => (
            <option key={index} value={s.id}>
              {s.id} - {s.name}
            </option>
          ))}
        </select>
      </div>

      {selectedId && (
        <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
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
                src={
                  typeof formData.samplePhoto === "string"
                    ? formData.samplePhoto
                    : URL.createObjectURL(formData.samplePhoto)
                }
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
              name="name"
              value={formData.name || ""}
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
              value={formData.species || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Genus */}
          <div>
            <label className="font-semibold">Genus</label>
            <input
              type="text"
              name="genus"
              value={formData.genus || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Kingdom */}
          <div>
            <label className="font-semibold">Kingdom</label>
            <input
              type="text"
              name="kingdom"
              value={formData.kingdom || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Date */}
          <div>
            <label className="font-semibold">Date Acquired</label>
            <input
              type="date"
              name="date"
              value={formData.date || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Map Section */}
          <div className="col-span-2">
            <label className="font-semibold">
              Sampling Location (click or search)
            </label>
            <MapContainer
              center={markerPosition || [-8.5, 115.5]}
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
              <p className="mt-2 text-sm text-gray-600">📍 {formData.location}</p>
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
                src={
                  typeof formData.semPhoto === "string"
                    ? formData.semPhoto
                    : URL.createObjectURL(formData.semPhoto)
                }
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
                src={
                  typeof formData.isolatedPhoto === "string"
                    ? formData.isolatedPhoto
                    : URL.createObjectURL(formData.isolatedPhoto)
                }
                alt="Isolated"
                className="mt-2 w-40 h-40 object-cover rounded-xl"
              />
            )}
          </div>

          {/* Save button */}
          <div className="col-span-2 text-center mt-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-xl shadow"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default EditSample;
