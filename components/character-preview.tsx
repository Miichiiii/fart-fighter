"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Fighter } from "@/lib/fighters";

interface CharacterPreviewProps {
  character: Fighter | null;
  player: 1 | 2;
  label: string;
}

export function CharacterPreview({
  character,
  player,
  label,
}: CharacterPreviewProps) {
  const accentColor = player === 1 ? "text-[#8B0000]" : "text-blue-500";
  const glowColor =
    player === 1
      ? "shadow-[0_0_60px_rgba(139,0,0,0.5)]"
      : "shadow-[0_0_60px_rgba(59,130,246,0.5)]";
  const borderColor = player === 1 ? "border-[#8B0000]" : "border-blue-500";

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className={`text-lg font-bold tracking-[0.3em] uppercase game-text ${accentColor}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {label}
      </motion.div>

      <div
        className={`relative w-48 h-60 md:w-56 md:h-72 lg:w-64 lg:h-80 border-4 ${borderColor} bg-[#0a0a0a] overflow-hidden rounded-lg ${character ? glowColor : ""}`}
      >
        <AnimatePresence mode="wait">
          {character ? (
            <motion.div
              key={character.id}
              className="absolute inset-0 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={character.sprite}
                alt={character.name}
                className="max-w-full max-h-full object-contain pixelated"
                style={{ imageRendering: "pixelated" }}
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${player === 1 ? "from-[#8B0000]/30" : "from-blue-500/30"} via-transparent to-transparent pointer-events-none`}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="text-gray-500 text-sm tracking-wider game-text text-center px-2">
                WÄHLE KÄMPFER
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={`absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 ${borderColor}`}
        />
        <div
          className={`absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 ${borderColor}`}
        />
        <div
          className={`absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 ${borderColor}`}
        />
        <div
          className={`absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 ${borderColor}`}
        />
      </div>

      <AnimatePresence mode="wait">
        {character && (
          <motion.div
            key={character.id}
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div
              className={`text-xl md:text-2xl font-bold tracking-wider uppercase game-text ${accentColor}`}
            >
              {character.name}
            </div>
            <div className="mt-2 text-xs text-gray-400 space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span>⚡</span>
                <div className="w-16 h-1.5 bg-gray-700 rounded overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{ width: `${character.stats.speed * 10}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span>💪</span>
                <div className="w-16 h-1.5 bg-gray-700 rounded overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${character.stats.power * 10}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span>🛡️</span>
                <div className="w-16 h-1.5 bg-gray-700 rounded overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${character.stats.defense * 10}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
