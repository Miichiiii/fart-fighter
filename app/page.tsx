/* ✨ Coded by
███╗   ███╗██╗██╗ ██████╗██╗  ██╗██╗██╗██╗██╗██╗
████╗ ████║██║██║██╔════╝██║  ██║██║██║██║██║██║
██╔████╔██║██║██║██║     ███████║██║██║██║██║██║
██║╚██╔╝██║██║██║██║     ██╔══██║██║██║██║██║╚═╝
██║ ╚═╝ ██║██║██║╚██████╗██║  ██║██║██║██║██║██╗
╚═╝     ╚═╝╚═╝╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝╚═╝╚═╝╚═╝╚═╝     
& AI ;-D
*/

"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSoundContext } from "@/components/sound-context";
import { initTelegramWebApp, useTelegramHaptic } from "@/lib/telegram";

export default function IntroScreen() {
  const router = useRouter();
  const [showStart, setShowStart] = useState(true);
  const [glitch, setGlitch] = useState(false);
  const glitchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { setCurrentTrack } = useSoundContext();
  const { impact } = useTelegramHaptic();

  const handleStart = () => {
    impact("medium");
    router.push(`/select`);
  };

  useEffect(() => {
    // Initialize Telegram WebApp
    initTelegramWebApp();
  }, []);

  useEffect(() => {
    // Set the track for this page
    setCurrentTrack("/Der Furzsong.mp3");

    // Glitch effect with random intervals
    const scheduleNextGlitch = () => {
      const randomDelay = 1000 + Math.random() * 4000; // Random delay between 1-5 seconds
      glitchTimeoutRef.current = setTimeout(() => {
        setGlitch(true);
        setTimeout(() => {
          setGlitch(false);
          scheduleNextGlitch(); // Schedule the next glitch
        }, 100 + Math.random() * 100); // Glitch duration 100-200ms
      }, randomDelay);
    };

    scheduleNextGlitch();

    return () => {
      if (glitchTimeoutRef.current) {
        clearTimeout(glitchTimeoutRef.current);
      }
    };
  }, [setCurrentTrack]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleStart();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Background with Berlin skyline */}
      <img
        src="/images/intro.gif"
        alt="Background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          filter: glitch ? "hue-rotate(180deg) saturate(3)" : "none",
          transform: glitch ? "translate(5px, 2px)" : "none",
          transition: "filter 0.1s ease, transform 0.1s ease",
        }}
      />

      <div className="z-10 flex flex-col items-center justify-center space-y-8">
        <button
          onClick={handleStart}
          onTouchStart={handleStart}
          className={`game-text text-white text-2xl mt-[650px] ${
            showStart ? "blink" : ""
          } cursor-pointer bg-transparent border-none`}
          style={{
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
          }}
        >
          Drücke "ENTER" zum Starten
        </button>

        <div className="text-white text-xs sm:text-sm text-center space-y-1 mt-[100px] sm:mt-[200px] px-2">
          <div
            style={{
              textShadow:
                "2px 2px 8px rgba(0, 0, 0, 0.9), 0 0 10px rgba(0, 0, 0, 0.7)",
            }}
          >
            Game Made by - Michael Medvidov
          </div>
          <div
            className="hidden sm:block"
            style={{
              textShadow:
                "2px 2px 8px rgba(0, 0, 0, 0.9), 0 0 10px rgba(0, 0, 0, 0.7)",
            }}
          >
            Co-Enginered by - VS-Code: Claude Sonnet 4.5, Gemini 2.5, deevid.ai
            & pixverse.ai
          </div>
          <div
            style={{
              textShadow:
                "2px 2px 8px rgba(0, 0, 0, 0.9), 0 0 10px rgba(0, 0, 0, 0.7)",
            }}
          >
            Music by - https://suno.com/
          </div>
        </div>
      </div>
    </div>
  );
}
