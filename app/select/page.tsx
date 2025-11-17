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
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-[#001428]">
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full max-w-7xl px-4 sm:px-8 lg:px-12 py-8">
        {/* Left side - Fighter Grid */}
        <div className="flex flex-col w-full lg:w-auto">
          <h2
            className="game-title text-xl sm:text-2xl lg:text-3xl text-center"
            style={{ marginBottom: "20px" }}
          >
            Wähle Deinen Furz-Kämpfer
          </h2>
          <div
            className="grid grid-cols-3 sm:grid-cols-2 gap-3 sm:gap-6"
            style={{ marginBottom: "40px" }}
          >
            {fighters.map((fighter, index) => (
              <button
                key={fighter.id}
                className={`relative cursor-pointer transition-all border-2 sm:border-4 active:scale-95 touch-manipulation ${
                  selectedIndex === index
                    ? "border-orange-500 shadow-lg shadow-orange-500/50"
                    : "border-gray-700 active:border-gray-500"
                }`}
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  padding: 0,
                  maxWidth: "100px",
                }}
                onClick={() => {
                  setSelectedIndex(index);
                }}
                onTouchStart={() => {
                  setSelectedIndex(index);
                }}
              >
                <Image
                  src={fighter.portrait || "/placeholder.svg"}
                  alt={fighter.name}
                  fill
                  sizes="(max-width: 640px) 80px, 100px"
                  className="pixelated object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>

          <button
            onClick={handleStartFight}
            onTouchStart={handleStartFight}
            className="text-center text-sm text-gray-400 game-text bg-black/60 py-3 px-6 rounded blink cursor-pointer border-2 border-gray-600 hover:border-orange-500 transition-colors"
          >
            {isMobile ? "Tippen zum Starten" : "Drücke ENTER zum Starten"}
          </button>
        </div>

        {/* Right side - Selected Fighter Details */}
        <div className="flex flex-col items-center game-text bg-black/80 p-4 sm:p-8 lg:p-10 rounded-lg shadow-2xl w-full lg:w-auto max-w-md">
          <div
            className="relative mb-4 sm:mb-8"
            style={{ width: "150px", height: "150px" }}
          >
            <Image
              src={fighters[selectedIndex].portrait || "/placeholder.svg"}
              alt={fighters[selectedIndex].name}
              width={150}
              height={150}
              style={{ width: "150px", height: "150px" }}
              className="pixelated object-cover"
              unoptimized
            />
          </div>

          <div
            className="text-xl sm:text-2xl lg:text-3xl text-center text-orange-400 font-bold uppercase"
            style={{ marginBottom: "40px" }}
          >
            {fighters[selectedIndex].name}
          </div>

          <div
            className="text-xs text-yellow-300 uppercase text-center"
            style={{ marginBottom: "10px" }}
          >
            Spezial-Attacke
          </div>

          <div
            className="text-sm sm:text-base lg:text-lg text-yellow-400 font-bold text-center bg-yellow-500/20 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded"
            style={{ marginBottom: "40px" }}
          >
            {fighters[selectedIndex].specialMove}
          </div>

          <div className="text-xs sm:text-sm text-gray-300 text-center max-w-md leading-relaxed italic bg-black/40 px-4 sm:px-6 py-3 sm:py-4 rounded">
            "{fighters[selectedIndex].description}"
          </div>
        </div>
      </div>
    </div>
  );
}
