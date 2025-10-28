import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import InfoCard from "../components/InfoCard";

export default function SearchSample({ samples = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [kingdomFilter, setKingdomFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  // Fixed kingdom list for consistency
  const kingdoms = ["All", "Animalia", "Plantae", "Fungi", "Protista", "Archaea", "Bacteria", "Chromista", "Undecided"];

  // Filtered samples
  const filteredSamples = useMemo(() => {
    return samples.filter((s) => {
      const matchesSearch =
        s.sampleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.sampleID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.species?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.genus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.family?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesKingdom =
        kingdomFilter === "All" || s.kingdom === kingdomFilter;

      const matchesProject =
        projectFilter === "All" || s.projectType === projectFilter;

      const matchesDate =
        (!startDate || new Date(s.date) >= new Date(startDate)) &&
        (!endDate || new Date(s.date) <= new Date(endDate));

      return matchesSearch && matchesKingdom && matchesProject && matchesDate;
    });
  }, [samples, searchTerm, kingdomFilter, projectFilter, startDate, endDate]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-3">
          Search Samples
        </h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name, species, ID, genus, family..."
            className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={kingdomFilter}
            onChange={(e) => setKingdomFilter(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
          >
            {kingdoms.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>

          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="All">All Projects</option>
            <option value="A">Project A</option>
            <option value="B">Project B</option>
          </select>

          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
        </div>

        {/* Results */}
        {filteredSamples.length === 0 ? (
          <div className="text-center py-12 text-gray-500 italic">
            No samples found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSamples.map((sample) => (
              <InfoCard
                key={sample.sampleID || sample.sampleName}
                title={sample.sampleName || sample.sampleID}
                sample={{
                  ...sample,
                  projectType: sample.projectType || sample.project, // ensure compatibility
                  location:
                    sample.latitude && sample.longitude
                      ? `${sample.latitude}, ${sample.longitude}`
                      : "N/A",
                  samplePhoto: sample.samplePhoto,
                  semPhoto: sample.semPhoto,
                  isolatedPhoto: sample.isolatedPhoto,
                }}
                color="from-blue-500 to-blue-400"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
