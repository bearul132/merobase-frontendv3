import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import { OpenStreetMapProvider } from "leaflet-geosearch";

export default function AddSample({ samples, setSamples }) {
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

  const kingdoms = ["Animalia","Plantae","Fungi","Protista","Archaea","Bacteria","Chromista","Undecided"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if(file){
      setFormData(prev => ({ ...prev, [field]: file }));
      setPhotoPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
    }
  };

  function LocationMarker() {
    useMapEvents({
      click(e){
        setMarkerPosition(e.latlng);
        setFormData(prev => ({
          ...prev,
          latitude: e.latlng.lat.toFixed(6),
          longitude: e.latlng.lng.toFixed(6)
        }));
      }
    });
    return markerPosition ? <Marker position={markerPosition} /> : null;
  }

  const handleSearch = async (e) => {
    if(e.key === "Enter"){
      e.preventDefault();
      const results = await provider.search({ query: e.target.value });
      if(results.length > 0){
        const { x, y } = results[0];
        const newPos = { lat: y, lng: x };
        setMarkerPosition(newPos);
        setFormData(prev => ({
          ...prev,
          latitude: y.toFixed(6),
          longitude: x.toFixed(6)
        }));
        mapRef.current.setView(newPos, 12);
      }
    }
  };

  useEffect(()=>{
    const { projectType, projectNumber, sampleNumber, semPhoto, isolatedPhoto } = formData;
    if(projectType && projectNumber && sampleNumber){
      const suffixes = [];
      if(semPhoto) suffixes.push("SEM");
      if(isolatedPhoto) suffixes.push("ISO");
      const suffix = suffixes.length ? "-" + suffixes.join("-") : "";
      setFormData(prev => ({ ...prev, sampleID: `${projectType}${projectNumber}-${sampleNumber}${suffix}` }));
    }
  }, [formData.projectType, formData.projectNumber, formData.sampleNumber, formData.semPhoto, formData.isolatedPhoto]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!formData.sampleName) return alert("Please enter a sample name!");

    const updatedSamples = [...samples, formData];
    setSamples(updatedSamples);
    localStorage.setItem("mero_samples", JSON.stringify(updatedSamples));

    alert("✅ Sample successfully added!");
    setFormData({
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
    setPhotoPreviews({});
    setMarkerPosition(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6F0FF] to-[#BFD7FF] p-8">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-12">
        <h1 className="text-4xl font-bold text-[#003366] mb-10 text-center">
          Add New Sample
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* PHOTO UPLOAD */}
          <section className="grid md:grid-cols-3 gap-6">
            {["samplePhoto","semPhoto","isolatedPhoto"].map(field => (
              <div key={field} className="flex flex-col items-center border-2 border-dashed border-[#003366]/30 rounded-2xl p-4 hover:border-[#003366] transition">
                <label className="text-[#003366] font-semibold mb-2 text-center">
                  {field === "samplePhoto" ? "Sample Photo" : field === "semPhoto" ? "SEM Photo" : "Isolated Photo"}
                </label>
                {photoPreviews[field] ? (
                  <img src={photoPreviews[field]} alt={field} className="w-44 h-44 object-cover rounded-lg shadow-md mb-3"/>
                ) : (
                  <div className="w-44 h-44 bg-gray-200/60 rounded-lg flex items-center justify-center text-gray-500 text-sm mb-3">
                    No image
                  </div>
                )}
                <input type="file" accept="image/*" onChange={(e)=>handleImageUpload(e, field)} className="text-sm"/>
              </div>
            ))}
          </section>

          {/* SAMPLE DETAILS */}
          <section className="grid md:grid-cols-2 gap-6">
            <input placeholder="Sample Name" name="sampleName" value={formData.sampleName} onChange={handleChange} className="input-field"/>
            <input placeholder="Species" name="species" value={formData.species} onChange={handleChange} className="input-field"/>
            <input placeholder="Genus" name="genus" value={formData.genus} onChange={handleChange} className="input-field"/>
            <input placeholder="Family" name="family" value={formData.family} onChange={handleChange} className="input-field"/>
            <select name="kingdom" value={formData.kingdom} onChange={handleChange} className="input-field">
              <option value="">Select Kingdom</option>
              {kingdoms.map(k=><option key={k} value={k}>{k}</option>)}
            </select>
            <select name="projectType" value={formData.projectType} onChange={handleChange} className="input-field">
              <option value="">Project Type</option>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
            <input type="number" placeholder="Project Number" name="projectNumber" value={formData.projectNumber} onChange={handleChange} className="input-field"/>
            <input type="number" placeholder="Sample Number" name="sampleNumber" value={formData.sampleNumber} onChange={handleChange} className="input-field"/>
          </section>

          {/* AUTO-GENERATED ID */}
          <section>
            <label className="block text-[#003366] font-semibold mb-2">Sample ID (Auto)</label>
            <input type="text" value={formData.sampleID} readOnly className="input-field bg-gray-100 text-gray-700"/>
          </section>

          {/* MAP */}
          <section>
            <label className="block text-[#003366] font-semibold mb-3">Sampling Location</label>
            <input type="text" placeholder="Search location and press Enter" onKeyDown={handleSearch} className="input-field mb-4"/>
            <div className="h-96 rounded-xl overflow-hidden shadow-md mb-4">
              <MapContainer center={[-8.5,115.5]} zoom={9} style={{height:"100%",width:"100%"}} whenCreated={map=>mapRef.current=map}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <LocationMarker/>
              </MapContainer>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <input type="text" placeholder="Latitude" name="latitude" value={formData.latitude} onChange={handleChange} className="input-field"/>
              <input type="text" placeholder="Longitude" name="longitude" value={formData.longitude} onChange={handleChange} className="input-field"/>
            </div>
          </section>

          {/* SUBMIT */}
          <div className="flex justify-center pt-4">
            <button type="submit" className="px-10 py-3 bg-[#003366] text-white font-semibold rounded-xl shadow-md hover:bg-[#004C99] transition">
              Save Sample
            </button>
          </div>
        </form>
      </div>

      {/* GLOBAL INPUT STYLE */}
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
          box-shadow: 0 0 0 2px rgba(0,102,204,0.2);
        }
      `}</style>
    </div>
  );
}
