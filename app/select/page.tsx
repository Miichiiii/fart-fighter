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

      <div className="z-10 flex flex-col items-center justify-center gap-1 sm:gap-2 lg:gap-3 w-full max-w-4xl px-1 sm:px-2 lg:px-4 py-1 sm:py-2 lg:py-4">
        {/* Fighter Grid - kompakter für mobile */}
        <div className="flex flex-col w-full items-center">
          <h2
            className="game-title text-sm sm:text-base lg:text-lg xl:text-xl text-center mb-1 sm:mb-2"
          >
            Wähle Deinen Furz-Kämpfer
          </h2>
          <div
            className="grid grid-cols-3 gap-0.5 sm:gap-1 lg:gap-2 mb-1 sm:mb-2"
          >
            {fighters.map((fighter, index) => (
              <button
                key={fighter.id}
                className={`relative cursor-pointer transition-all border-0.5 sm:border-1 lg:border-2 active:scale-95 touch-manipulation ${
                  selectedIndex === index
                    ? "border-orange-500 shadow-lg shadow-orange-500/50"
                    : "border-gray-700 active:border-gray-500"
                }`}
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  padding: 0,
                  maxWidth: isMobile ? "55px" : "70px",
                  minWidth: isMobile ? "45px" : "60px",
                }}
                onClick={() => {
                  selection();
                  setSelectedIndex(index);
                }}
                onTouchStart={() => {
                  selection();
                  setSelectedIndex(index);
                }}
              >
                <Image
                  src={fighter.portrait || "/placeholder.svg"}
                  alt={fighter.name}
                  fill
                  sizes="(max-width: 640px) 45px, (max-width: 1024px) 60px, 70px"
                  className="pixelated object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>

          <button
            onClick={handleStartFight}
            onTouchStart={handleStartFight}
            className="text-center text-xs sm:text-sm lg:text-base text-white game-text bg-gradient-to-r from-orange-600 to-orange-500 py-1.5 px-3 sm:py-2 sm:px-4 lg:py-3 lg:px-6 rounded-md blink cursor-pointer border-0.5 sm:border-1 lg:border-2 border-orange-400 hover:border-orange-300 active:scale-95 transition-all shadow-lg shadow-orange-500/50 touch-manipulation font-bold"
            style={{
              minHeight: "35px",
              minWidth: isMobile ? "100%" : "160px",
              maxWidth: isMobile ? "220px" : "180px",
            }}
          >
            🎮 Kampf Starten
          </button>
        </div>

        {/* Selected Fighter Details - kompakter für mobile */}
        <div className="flex flex-col items-center game-text bg-black/90 p-1.5 sm:p-2 lg:p-3 rounded-lg shadow-2xl w-full max-w-xs sm:max-w-sm">
          <div
            className="relative mb-1 sm:mb-2 border-0.5 sm:border-1 lg:border-2 border-orange-400 rounded-lg overflow-hidden shadow-xl shadow-orange-500/30"
            style={{
              width: isMobile ? "80px" : "110px",
              height: isMobile ? "80px" : "110px"
            }}
          >
            <Image
              src={fighters[selectedIndex].portrait || "/placeholder.svg"}
              alt={fighters[selectedIndex].name}
              width={isMobile ? 80 : 110}
              height={isMobile ? 80 : 110}
              style={{
                width: isMobile ? "80px" : "110px",
                height: isMobile ? "80px" : "110px"
              }}
              className="pixelated object-cover"
              unoptimized
            />
          </div>

          <div
            className="text-xs sm:text-sm lg:text-base text-center text-orange-400 font-bold uppercase tracking-wider mb-0.5 sm:mb-1"
            style={{
              textShadow: "0 0 10px rgba(255, 140, 0, 0.6)",
            }}
          >
            {fighters[selectedIndex].name}
          </div>

          <div
            className="text-xs text-yellow-300 uppercase text-center mb-0.5"
          >
            Spezial-Attacke
          </div>

          <div
            className="text-xs sm:text-sm text-yellow-400 font-bold text-center bg-yellow-500/20 px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-1 rounded mb-0.5 sm:mb-1"
          >
            {fighters[selectedIndex].specialMove}
          </div>

          <div className="text-xs text-gray-300 text-center max-w-xs leading-tight italic bg-black/40 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
            "{fighters[selectedIndex].description}"
          </div>
        </div>
      </div>
    </div>
  );
}
