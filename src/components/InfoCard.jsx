import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import meroBanner from "../assets/mero.png";

export default function InfoCard({ title, sample, color = "from-blue-500 to-blue-400" }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded((prev) => !prev);

  return (
    <motion.div
      layout
      onClick={toggleExpand}
      className={`cursor-pointer bg-gradient-to-br ${color} rounded-2xl p-4 text-white shadow-md hover:shadow-lg transition-all duration-300`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Banner shown only when expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 120 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="relative rounded-xl overflow-hidden mb-4"
          >
            <img
              src={meroBanner}
              alt="MERO Banner"
              className="w-full h-28 object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <h4 className="text-lg font-semibold tracking-wide text-white">
                {title}
              </h4>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Front content */}
      <motion.div layout className="space-y-2">
        {!expanded && (
          <h4 className="text-lg font-semibold tracking-wide">{title}</h4>
        )}
        <p className="text-sm">
          <span className="font-semibold">Species:</span> {sample?.species || "N/A"}
        </p>
        <p className="text-sm">
          <span className="font-semibold">Date:</span> {sample?.date || "N/A"}
        </p>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.3 }}
              className="pt-2 border-t border-white/30 space-y-1 text-sm"
            >
              <p>
                <span className="font-semibold">Project Type:</span> {sample?.projectType || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Project #:</span> {sample?.projectNumber || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Sample #:</span> {sample?.sampleNumber || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Genus:</span> {sample?.genus || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Family:</span> {sample?.family || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Kingdom:</span> {sample?.kingdom || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Latitude:</span> {sample?.latitude || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Longitude:</span> {sample?.longitude || "N/A"}
              </p>

              {/* Conditional photo display */}
              {sample?.samplePhoto && (
                <img
                  src={sample.samplePhoto}
                  alt="Sample"
                  className="mt-2 w-full h-36 object-cover rounded-lg border border-white/20"
                />
              )}
              {sample?.semPhoto && (
                <img
                  src={sample.semPhoto}
                  alt="SEM"
                  className="mt-2 w-full h-36 object-cover rounded-lg border border-white/20"
                />
              )}
              {sample?.isolatedPhoto && (
                <img
                  src={sample.isolatedPhoto}
                  alt="Isolated"
                  className="mt-2 w-full h-36 object-cover rounded-lg border border-white/20"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
