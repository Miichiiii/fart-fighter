"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { fighters } from "@/lib/fighters";
import { useSoundContext } from "@/components/sound-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTelegramHaptic } from "@/lib/telegram";

export default function CharacterSelect() {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { setCurrentTrack } = useSoundContext();
  const isMobile = useIsMobile();
  const { impact, selection } = useTelegramHaptic();

  const handleStartFight = () => {
    impact("medium");
    router.push(
      `/fight?player=${fighters[selectedIndex].id}&round=1&difficulty=1.0&prevOpponents=`
    );
  };

  useEffect(() => {
    // Set the track for this page
    setCurrentTrack("/Der Furzsong2.mp3");
  }, [setCurrentTrack]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          selection();
          setSelectedIndex((prev) => (prev + 1) % fighters.length);
          break;
        case "ArrowLeft":
          selection();
          setSelectedIndex(
            (prev) => (prev - 1 + fighters.length) % fighters.length
          );
          break;
        case "ArrowUp":
          setSelectedIndex((prev) => {
            // For a 3x2 grid (6 fighters)
            if (prev < 3) {
              return prev + 3;
            }
            return prev - 3;
          });
          break;
        case "ArrowDown":
          setSelectedIndex((prev) => {
            // For a 3x2 grid (6 fighters)
            if (prev >= 3) {
              return prev - 3;
            }
            return prev + 3;
          });
          break;
        case "Enter":
          handleStartFight();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, router]);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black"
      style={{ height: "100dvh", minHeight: "-webkit-fill-available" }}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-[#001428]">
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="z-10 flex flex-col items-center justify-center gap-4 sm:gap-5 lg:gap-6 w-full max-w-3xl px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
        {/* Title - zentriert */}
        <h1
          className="game-title text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-center text-orange-400 drop-shadow-lg w-full"
          style={{ textShadow: "0 0 20px rgba(255, 140, 0, 0.8)" }}
        >
          Wähle Deinen Furz-Kämpfer
        </h1>

        {/* Fighter Grid - perfekt zentriert */}
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-3 gap-4 sm:gap-5 lg:gap-6 justify-items-center">
            {fighters.map((fighter, index) => (
              <button
                key={fighter.id}
                className={`relative cursor-pointer transition-all rounded-xl overflow-hidden active:scale-95 touch-manipulation shadow-lg ${
                  selectedIndex === index
                    ? "ring-4 ring-orange-500 shadow-orange-500/70 scale-110"
                    : "ring-2 ring-gray-600 hover:ring-orange-400/60 opacity-80 hover:opacity-100"
                }`}
                style={{
                  width: isMobile ? "95px" : "130px",
                  height: isMobile ? "95px" : "130px",
                  background:
                    selectedIndex === index
                      ? "linear-gradient(135deg, #ff8c00 0%, #ff4500 100%)"
                      : "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                }}
                onClick={() => {
                  selection();
                  setSelectedIndex(index);
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  selection();
                  setSelectedIndex(index);
                }}
              >
                <Image
                  src={fighter.portrait || "/placeholder.svg"}
                  alt={fighter.name}
                  fill
                  sizes="(max-width: 640px) 95px, 130px"
                  className="pixelated object-cover"
                  unoptimized
                  priority={index < 3}
                />
                {selectedIndex === index && (
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-500/40 via-transparent to-transparent pointer-events-none" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Fighter Details - perfekt zentriert */}
        <div className="flex flex-col items-center justify-center game-text bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-md p-5 sm:p-6 lg:p-8 rounded-2xl shadow-2xl max-w-md border-2 border-orange-500/50 self-center">
          <div
            className="relative mb-4 sm:mb-5 rounded-xl overflow-hidden shadow-2xl ring-4 ring-orange-400"
            style={{
              width: isMobile ? "140px" : "180px",
              height: isMobile ? "140px" : "180px",
            }}
          >
            <Image
              src={fighters[selectedIndex].portrait || "/placeholder.svg"}
              alt={fighters[selectedIndex].name}
              fill
              sizes="(max-width: 640px) 140px, 180px"
              className="pixelated object-cover"
              unoptimized
              priority
            />
          </div>

          <h2
            className="text-2xl sm:text-3xl lg:text-4xl text-center text-orange-400 font-black uppercase tracking-wide mb-3 sm:mb-4 w-full"
            style={{
              textShadow:
                "0 0 15px rgba(255, 140, 0, 0.9), 0 0 30px rgba(255, 140, 0, 0.5)",
            }}
          >
            {fighters[selectedIndex].name}
          </h2>

          <div className="text-sm sm:text-base text-yellow-300/90 uppercase text-center mb-2 font-semibold tracking-wider w-full">
            ⚡ Spezial-Attacke ⚡
          </div>

          <div className="text-base sm:text-lg lg:text-xl text-yellow-400 font-bold text-center bg-gradient-to-r from-yellow-500/30 to-orange-500/30 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl mb-3 sm:mb-4 border-2 border-yellow-500/50 shadow-lg w-full max-w-sm mx-auto">
            {fighters[selectedIndex].specialMove}
          </div>

          <div className="text-sm sm:text-base text-gray-300 text-center max-w-sm leading-relaxed italic bg-black/60 px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-gray-600/40 mx-auto">
            "{fighters[selectedIndex].description}"
          </div>
        </div>

        {/* Start Button - zentriert */}
        <button
          onClick={handleStartFight}
          onTouchStart={handleStartFight}
          className="text-lg sm:text-xl lg:text-2xl text-white game-text font-black uppercase tracking-wider bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 py-4 px-12 sm:py-5 sm:px-20 lg:py-6 lg:px-24 rounded-xl blink cursor-pointer ring-4 ring-orange-400 hover:ring-orange-300 active:scale-95 transition-all shadow-2xl shadow-orange-500/70 touch-manipulation mx-auto"
          style={{
            minHeight: "60px",
            textShadow: "0 2px 8px rgba(0, 0, 0, 0.8)",
          }}
        >
          🎮 KAMPF STARTEN 🎮
        </button>
      </div>
    </div>
  );
}
