import { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function SearchSample({ samples = [] }) {
  const [query, setQuery] = useState("");
  const [kingdom, setKingdom] = useState("");
  const [projectType, setProjectType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const navigate = useNavigate();

  // 🧠 Filter logic
  const filteredSamples = samples.filter((sample) => {
    const matchSearch =
      query === "" ||
      [sample.name, sample.id, sample.species, sample.genus, sample.family]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());

    const matchKingdom =
      kingdom === "" || sample.kingdom?.toLowerCase() === kingdom.toLowerCase();

    const matchProject =
      projectType === "" ||
      sample.projectType?.toLowerCase() === projectType.toLowerCase();

    const matchDate =
      (!dateFrom || new Date(sample.date) >= new Date(dateFrom)) &&
      (!dateTo || new Date(sample.date) <= new Date(dateTo));

    return matchSearch && matchKingdom && matchProject && matchDate;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
          Search Samples
        </h1>

        {/* Search & Filter Section */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            {/* 🔍 Text Search */}
            <input
              type="text"
              placeholder="Search by name, ID, species, genus, or family..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border p-2 rounded-lg w-full"
            />

            {/* 🌿 Kingdom Filter */}
            <select
              value={kingdom}
              onChange={(e) => setKingdom(e.target.value)}
              className="border p-2 rounded-lg w-full"
            >
              <option value="">All Kingdoms</option>
              <option value="Animalia">Animalia</option>
              <option value="Plantae">Plantae</option>
              <option value="Fungi">Fungi</option>
              <option value="Monera">Monera</option>
              <option value="Protista">Protista</option>
              <option value="Bacteria">Bacteria</option>
            </select>

            {/* 🧩 Project Type */}
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="border p-2 rounded-lg w-full"
            >
              <option value="">All Projects</option>
              <option value="A">Project A</option>
              <option value="B">Project B</option>
            </select>

            {/* 📅 Date Range */}
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border p-2 rounded-lg w-full"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border p-2 rounded-lg w-full"
              />
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-green-200 text-green-900">
              <tr>
                <th className="p-3 text-left border">ID</th>
                <th className="p-3 text-left border">Name</th>
                <th className="p-3 text-left border">Species</th>
                <th className="p-3 text-left border">Genus</th>
                <th className="p-3 text-left border">Family</th>
                <th className="p-3 text-left border">Kingdom</th>
                <th className="p-3 text-left border">Project</th>
                <th className="p-3 text-left border">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredSamples.length > 0 ? (
                filteredSamples.map((sample, i) => (
                  <tr key={i} className="hover:bg-green-50">
                    <td className="p-3 border">{sample.id}</td>
                    <td className="p-3 border">{sample.name}</td>
                    <td className="p-3 border">{sample.species}</td>
                    <td className="p-3 border">{sample.genus}</td>
                    <td className="p-3 border">{sample.family}</td>
                    <td className="p-3 border">{sample.kingdom}</td>
                    <td className="p-3 border">{sample.projectType}</td>
                    <td className="p-3 border">{sample.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No samples found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Back Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            ⬅ Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
