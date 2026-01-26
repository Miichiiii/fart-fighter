"use client";

import { motion } from "framer-motion";

export function VsIndicator() {
  return (
    <motion.div
      className="relative flex items-center justify-center w-24 h-24 md:w-32 md:h-32"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[#8B0000]/30 blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* VS Text */}
      <motion.span
        className="relative text-4xl md:text-5xl font-black text-[#FFD700] drop-shadow-[0_0_20px_rgba(255,215,0,0.8)] game-title"
        animate={{
          textShadow: [
            "0 0 20px rgba(255,215,0,0.8)",
            "0 0 40px rgba(255,215,0,1)",
            "0 0 20px rgba(255,215,0,0.8)",
          ],
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        VS
      </motion.span>
    </motion.div>
  );
}
