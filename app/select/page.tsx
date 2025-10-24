"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { fighters } from "@/lib/fighters";
import { useSoundContext } from "@/components/sound-context";

export default function CharacterSelect() {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { setCurrentTrack } = useSoundContext();

  useEffect(() => {
    // Set the track for this page
    setCurrentTrack("/Der Furzsong2.mp3");
  }, [setCurrentTrack]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          setSelectedIndex((prev) => (prev + 1) % fighters.length);
          break;
        case "ArrowLeft":
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
          // Navigate to fight
          router.push(
            `/fight?player=${fighters[selectedIndex].id}&round=1&difficulty=1.0&prevOpponents=`
          );
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

      <div className="z-10 flex items-center justify-center gap-16 w-full max-w-7xl px-12">
        {/* Left side - Fighter Grid */}
        <div className="flex flex-col">
          <h2
            className="game-title text-3xl text-center"
            style={{ marginBottom: "40px" }}
          >
            Wähle Deinen Furz-Kämpfer
          </h2>
          <div
            className="grid grid-cols-2 gap-6"
            style={{ marginBottom: "80px" }}
          >
            {fighters.map((fighter, index) => (
              <div
                key={fighter.id}
                className={`relative cursor-pointer transition-all border-4 ${
                  selectedIndex === index
                    ? "border-orange-500 shadow-lg shadow-orange-500/50"
                    : "border-gray-700 hover:border-gray-500"
                }`}
                style={{ width: "100px", height: "100px" }}
                onClick={() => {
                  setSelectedIndex(index);
                }}
              >
                <Image
                  src={fighter.portrait || "/placeholder.svg"}
                  alt={fighter.name}
                  width={100}
                  height={100}
                  style={{ width: "100px", height: "100px" }}
                  className="pixelated object-cover"
                />
              </div>
            ))}
          </div>

          <div className="text-center text-sm text-gray-400 game-text bg-black/60 py-3 px-6 rounded blink">
            Drücke ENTER zum Starten
          </div>
        </div>

        {/* Right side - Selected Fighter Details */}
        <div className="flex flex-col items-center game-text bg-black/80 p-10 rounded-lg shadow-2xl">
          <div
            className="relative mb-8"
            style={{ width: "250px", height: "250px" }}
          >
            <Image
              src={fighters[selectedIndex].portrait || "/placeholder.svg"}
              alt={fighters[selectedIndex].name}
              width={250}
              height={250}
              style={{ width: "250px", height: "250px" }}
              className="pixelated object-cover"
            />
          </div>

          <div
            className="text-3xl text-center text-orange-400 font-bold uppercase"
            style={{ marginBottom: "80px" }}
          >
            {fighters[selectedIndex].name}
          </div>

          <div
            className="text-xs text-yellow-300 uppercase text-center"
            style={{ marginBottom: "20px" }}
          >
            Spezial-Attacke
          </div>

          <div
            className="text-lg text-yellow-400 font-bold text-center bg-yellow-500/20 px-8 py-4 rounded"
            style={{ marginBottom: "80px" }}
          >
            {fighters[selectedIndex].specialMove}
          </div>

          <div className="text-sm text-gray-300 text-center max-w-md leading-relaxed italic bg-black/40 px-6 py-4 rounded">
            "{fighters[selectedIndex].description}"
          </div>
        </div>
      </div>
    </div>
  );
}
