export default function InfoCard({ title, sample, color }) {
  if (!sample) return null;

  return (
    <div
      className={`bg-gradient-to-br ${color} text-white p-5 rounded-2xl shadow-lg flex flex-col`}
    >
      <h2 className="text-xl font-semibold mb-3">{title}</h2>

      {sample.samplePhoto && (
        <img
          src={sample.samplePhoto}
          alt="Sample"
          className="w-full h-48 object-cover rounded-lg mb-3 shadow-md"
        />
      )}

      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-sm space-y-1">
        <p><strong>ID:</strong> {sample.id}</p>
        <p><strong>Name:</strong> {sample.name || "-"}</p>
        <p><strong>Species:</strong> {sample.species || "-"}</p>
        <p><strong>Genus:</strong> {sample.genus || "-"}</p>
        <p><strong>Kingdom:</strong> {sample.kingdom || "-"}</p>
        <p><strong>Project:</strong> {sample.projectType} - {sample.projectNumber}</p>
        <p><strong>Sample No:</strong> {sample.sampleNumber}</p>
        <p><strong>Date:</strong> {sample.date || "-"}</p>
        <p><strong>Location:</strong> {sample.location || "-"}</p>
      </div>

      {(sample.semPhoto || sample.isolatedPhoto) && (
        <div className="flex gap-3 mt-3">
          {sample.semPhoto && (
            <img
              src={sample.semPhoto}
              alt="SEM"
              className="w-20 h-20 object-cover rounded-lg border-2 border-white/40"
            />
          )}
          {sample.isolatedPhoto && (
            <img
              src={sample.isolatedPhoto}
              alt="Isolated"
              className="w-20 h-20 object-cover rounded-lg border-2 border-white/40"
            />
          )}
        </div>
      )}
    </div>
  );
}
