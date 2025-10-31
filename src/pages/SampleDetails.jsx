import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const SampleDetails = ({ samples }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const sample = samples.find((s) => s.sampleID === id);

  // Format the registered date only
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

  if (!sample) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-700">
        <h1 className="text-2xl font-semibold mb-4">Sample Not Found</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Banner */}
        <div className="relative h-40 bg-blue-600">
          <img
            src="/mero.png"
            alt="MEROBase Banner"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 flex items-center justify-center text-white text-3xl font-semibold">
            Sample Details
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">
              {sample.sampleName || "Unnamed Sample"}
            </h2>
            <span className="text-gray-500 text-sm">
              ID: {sample.sampleID || "N/A"}
            </span>
          </div>

          {/* Photos Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sample.samplePhoto && (
              <div>
                <p className="font-medium text-gray-600 mb-1">Sample Photo</p>
                <img
                  src={sample.samplePhoto}
                  alt="Sample"
                  className="w-full rounded-lg border"
                />
              </div>
            )}
            {sample.semPhoto && (
              <div>
                <p className="font-medium text-gray-600 mb-1">SEM Photo</p>
                <img
                  src={sample.semPhoto}
                  alt="SEM"
                  className="w-full rounded-lg border"
                />
              </div>
            )}
            {sample.isolatedPhoto && (
              <div>
                <p className="font-medium text-gray-600 mb-1">Isolated Photo</p>
                <img
                  src={sample.isolatedPhoto}
                  alt="Isolated"
                  className="w-full rounded-lg border"
                />
              </div>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p><span className="font-semibold">Species:</span> {sample.species || "N/A"}</p>
              <p><span className="font-semibold">Genus:</span> {sample.genus || "N/A"}</p>
              <p><span className="font-semibold">Family:</span> {sample.family || "N/A"}</p>
              <p><span className="font-semibold">Kingdom:</span> {sample.kingdom || "N/A"}</p>
              <p><span className="font-semibold">Project Type:</span> {sample.projectType || "N/A"}</p>
            </div>
            <div>
              <p><span className="font-semibold">Collected By:</span> {sample.collectorName || "N/A"}</p>
              <p><span className="font-semibold">Registered Date:</span> {formatDate(sample.dateCollected)}</p>
              <p><span className="font-semibold">Location:</span></p>
              <p className="ml-4 text-sm text-gray-600">
                Lat: {sample.latitude || "N/A"} <br /> Lng: {sample.longitude || "N/A"}
              </p>
            </div>
          </div>

          {/* Map Section */}
          {sample.latitude && sample.longitude && (
            <div className="h-64 rounded-xl overflow-hidden">
              <MapContainer
                center={[sample.latitude, sample.longitude]}
                zoom={10}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution="© OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[sample.latitude, sample.longitude]}
                  icon={markerIcon}
                />
              </MapContainer>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleDetails;
