"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CharacterCard } from "./character-card";
import { CharacterPreview } from "./character-preview";
import { SmokyBackground } from "./smoky-background";
import { fighters } from "@/lib/fighters";
import { useRouter } from "next/navigation";

export function CharacterSelect() {
  const router = useRouter();
  const [selectedFighter, setSelectedFighter] = useState<string | null>(null);
  const [showReady, setShowReady] = useState(false);

  const handleSelect = useCallback((characterId: string) => {
    setSelectedFighter(characterId);
  }, []);

  const selectedCharacter =
    fighters.find((c) => c.id === selectedFighter) || null;
  const isReady = selectedFighter !== null;

  // Handle Enter key to confirm
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isReady) {
        handleFight();
      }
      // Reset with Escape
      if (e.key === "Escape") {
        setSelectedFighter(null);
        setShowReady(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isReady, selectedFighter]);

  const handleFight = () => {
    if (isReady && selectedFighter) {
      setShowReady(true);
      setTimeout(() => {
        router.push(
          `/fight?player=${selectedFighter}&round=1&difficulty=1.0&prevOpponents=`,
        );
      }, 1500);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a] flex flex-col">
      <SmokyBackground />

      <div className="relative z-10 flex flex-col h-screen p-3 md:p-4">
        {/* Header */}
        <motion.header
          className="text-center py-3"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white game-title">
            WÄHLE DEINEN KÄMPFER
          </h1>
        </motion.header>

        {/* Main Content - 2 Column Layout with Whitespace Separation */}
        <div className="flex-1 flex items-center justify-center gap-16 lg:gap-24 overflow-hidden px-8">
          {/* LEFT COLUMN - Selection Panel */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Sub-Header */}
            <h2 className="text-lg font-bold text-[#FFD700] mb-3 game-text tracking-wider">
              KÄMPFER
            </h2>

            {/* 2x3 Grid - 6 Thumbnails */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-16 mb-8">
              {fighters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  isSelected={selectedFighter === character.id}
                  onSelect={() => handleSelect(character.id)}
                  player={selectedFighter === character.id ? 1 : null}
                />
              ))}
            </div>

            {/* Start Button */}
            {isReady ? (
              <button
                onClick={handleFight}
                className="w-full px-8 py-3 bg-gradient-to-r from-[#8B0000] to-[#FF4500] text-white text-lg font-black tracking-wider 
                           rounded-xl shadow-[0_0_40px_rgba(139,0,0,0.7)] hover:shadow-[0_0_60px_rgba(139,0,0,0.9)]
                           transition-all duration-300 hover:scale-105 active:scale-95 game-text"
              >
                SPIEL STARTEN
              </button>
            ) : (
              <p className="text-gray-500 text-sm game-text tracking-wider text-center">
                Wähle einen Kämpfer zum Starten
              </p>
            )}
          </motion.div>

          {/* RIGHT COLUMN - Detail Panel (Preview Area) */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Sub-Header - Same horizontal level as left */}
            <h2 className="text-lg font-bold text-[#FFD700] mb-3 game-text tracking-wider">
              AUSGEWÄHLTER KÄMPFER
            </h2>

            <AnimatePresence mode="wait">
              {selectedCharacter ? (
                <motion.div
                  key={selectedCharacter.id}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Featured Image - Hero Image (2-3x larger than thumbnails) */}
                  <div className="relative w-[280px] h-[280px] border-4 border-[#8B0000] bg-[#1A1A1A] rounded-lg overflow-hidden shadow-[0_0_40px_rgba(139,0,0,0.6)] mb-4">
                    <img
                      src={selectedCharacter.sprite}
                      alt={selectedCharacter.name}
                      className="w-full h-full object-contain pixelated p-4"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>

                  {/* Info Container - Centered Text Block */}
                  <div className="w-[280px] text-center">
                    {/* Detail Header - Character Name */}
                    <h3 className="text-xl font-black text-[#8B0000] game-text tracking-wider mb-2">
                      {selectedCharacter.name}
                    </h3>

                    {/* Description Text Block */}
                    <p className="text-gray-300 text-sm italic mb-3">
                      "{selectedCharacter.description}"
                    </p>

                    {/* Attribute Row - Stats */}
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
                      <p className="text-[#FFD700] text-sm font-bold mb-3">
                        ⚡ {selectedCharacter.specialMove}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 text-xs w-24 text-left">
                            Geschwindigkeit
                          </span>
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-yellow-500 h-2 rounded-full transition-all"
                              style={{
                                width: `${selectedCharacter.stats.speed * 10}%`,
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 text-xs w-24 text-left">
                            Stärke
                          </span>
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full transition-all"
                              style={{
                                width: `${selectedCharacter.stats.power * 10}%`,
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 text-xs w-24 text-left">
                            Verteidigung
                          </span>
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all"
                              style={{
                                width: `${selectedCharacter.stats.defense * 10}%`,
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 text-xs w-24 text-left">
                            Ausdauer
                          </span>
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all"
                              style={{
                                width: `${selectedCharacter.stats.stamina * 10}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="w-[280px] h-[400px] flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-gray-500 text-lg game-text">
                    Wähle einen Kämpfer
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Ready Animation Overlay */}
      <AnimatePresence>
        {showReady && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <h2 className="text-6xl md:text-8xl font-black text-[#FFD700] drop-shadow-[0_0_40px_rgba(255,215,0,0.8)] tracking-wider game-title">
                KAMPF!
              </h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
