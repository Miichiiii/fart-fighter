"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Fighter } from "@/lib/fighters";

interface CharacterCardProps {
  character: Fighter;
  isSelected: boolean;
  onSelect: () => void;
  player: 1 | 2 | null;
}

export function CharacterCard({
  character,
  isSelected,
  onSelect,
  player,
}: CharacterCardProps) {
  const getBorderColor = () => {
    if (player === 1)
      return "border-[#8B0000] shadow-[0_0_15px_rgba(139,0,0,0.6)]";
    if (player === 2)
      return "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]";
    return "border-gray-700 hover:border-[#FFD700]";
  };

  const getPlayerBadge = () => {
    if (player === 1) return "P1";
    if (player === 2) return "P2";
    return null;
  };

  return (
    <motion.button
      onClick={onSelect}
      className={`relative w-[100px] h-[100px] border-2 ${getBorderColor()} 
                  bg-[#1A1A1A] overflow-hidden transition-all duration-200 
                  hover:scale-105 active:scale-95 cursor-pointer rounded-lg`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      disabled={isSelected}
    >
      {/* Character portrait */}
      <div className="w-full h-full flex items-center justify-center">
        <img
          src={character.portrait}
          alt={character.name}
          className="w-full h-full object-cover pixelated"
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      {/* Hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity" />

      {/* Player badge */}
      {player && (
        <motion.div
          className={`absolute top-2 right-2 px-2 py-1 text-sm font-bold rounded
                      ${player === 1 ? "bg-[#8B0000] text-white" : "bg-blue-500 text-white"}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          {getPlayerBadge()}
        </motion.div>
      )}

      {/* Character name on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
        <p className="text-xs md:text-sm text-white font-bold tracking-wider truncate text-center game-text">
          {character.name}
        </p>
      </div>

      {/* Selection glow animation */}
      {isSelected && (
        <motion.div
          className={`absolute inset-0 ${player === 1 ? "bg-[#8B0000]/20" : "bg-blue-500/20"}`}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
