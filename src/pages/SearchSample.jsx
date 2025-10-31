import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import InfoCard from "../components/InfoCard";
import { Search, Calendar, Filter } from "lucide-react";

export default function SearchSample({ samples = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [kingdomFilter, setKingdomFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  const kingdoms = [
    "All",
    "Animalia",
    "Plantae",
    "Fungi",
    "Protista",
    "Archaea",
    "Bacteria",
    "Chromista",
    "Undecided",
  ];

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
        (!startDate || new Date(s.dateCollected) >= new Date(startDate)) &&
        (!endDate || new Date(s.dateCollected) <= new Date(endDate));

      return matchesSearch && matchesKingdom && matchesProject && matchesDate;
    });
  }, [samples, searchTerm, kingdomFilter, projectFilter, startDate, endDate]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6 font-inter">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 border-b pb-5">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Filter className="w-6 h-6 text-blue-600" />
            Search Samples
          </h1>
          <p className="text-slate-500 text-sm mt-2 sm:mt-0">
            Efficiently browse, filter, and analyze sample records
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-slate-100 p-5 rounded-xl mb-10 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center">
          {/* Search */}
          <div className="relative col-span-2">
            <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, ID, species, genus, or family..."
              className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Kingdom Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Kingdom
            </label>
            <select
              value={kingdomFilter}
              onChange={(e) => setKingdomFilter(e.target.value)}
              className="border border-slate-300 rounded-lg p-2.5 w-full bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {kingdoms.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          {/* Project Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Project Type
            </label>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="border border-slate-300 rounded-lg p-2.5 w-full bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="All">All Projects</option>
              <option value="A">Project A</option>
              <option value="B">Project B</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="flex flex-col">
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              Date Range
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-slate-300 rounded-lg px-2 py-2 bg-white w-full focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-slate-300 rounded-lg px-2 py-2 bg-white w-full focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredSamples.length === 0 ? (
          <div className="text-center py-20 text-slate-500 italic border-t border-slate-200">
            No samples found matching your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSamples.map((sample) => (
              <div
                key={sample.sampleID || sample.sampleName}
                className="transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <InfoCard
                  title={sample.sampleName || sample.sampleID}
                  sample={{
                    ...sample,
                    dateCollected: sample.dateCollected,
                    projectType: sample.projectType,
                  }}
                  color="from-blue-700 to-blue-400"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
