"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { fighters } from "@/lib/fighters";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTelegramHaptic } from "@/lib/telegram";

export default function WinnerScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const winner = searchParams.get("winner");
  const playerId = searchParams.get("player") || fighters[0].id;
  const cpuId = searchParams.get("cpu") || fighters[1].id;
  const roundCount = Number.parseInt(searchParams.get("round") || "1", 10);
  const difficulty = Number.parseFloat(searchParams.get("difficulty") || "1.0");
  const isMobile = useIsMobile();
  const { impact, notification } = useTelegramHaptic();

  // Get previous opponents from URL
  const previousOpponentsParam = searchParams.get("prevOpponents") || "";
  const previousOpponents = previousOpponentsParam
    ? previousOpponentsParam.split(",")
    : [];

  const playerFighter = fighters.find((f) => f.id === playerId) || fighters[0];
  const cpuFighter = fighters.find((f) => f.id === cpuId) || fighters[1];

  const [showContinue, setShowContinue] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [isCountingDown, setIsCountingDown] = useState(winner === "player");

  // Function to start next round with a new opponent
  const startNextRound = useCallback(() => {
    impact("medium");
    if (winner === "player") {
      notification("success");
      // Get a random opponent different from the current one and previous 5 opponents
      const opponentsToAvoid = [playerId, cpuId, ...previousOpponents];
      const availableFighters = fighters.filter(
        (f) => !opponentsToAvoid.includes(f.id)
      );

      // If we've exhausted all fighters, just avoid the current one
      const fightersToChooseFrom =
        availableFighters.length > 0
          ? availableFighters
          : fighters.filter((f) => f.id !== cpuId && f.id !== playerId);

      const randomIndex = Math.floor(
        Math.random() * fightersToChooseFrom.length
      );
      const newOpponent = fightersToChooseFrom[randomIndex];

      // Update previous opponents list (keep only the last 4 to make room for current opponent)
      const updatedPreviousOpponents = [...previousOpponents, cpuId].slice(-4);

      // Increase difficulty for the next round
      const newDifficulty = difficulty + 0.2;

      // Start next round with new opponent and increased difficulty
      router.push(
        `/fight?player=${playerId}&cpu=${newOpponent.id}&round=${
          roundCount + 1
        }&difficulty=${newDifficulty.toFixed(
          1
        )}&prevOpponents=${updatedPreviousOpponents.join(",")}`
      );
    } else {
      // If player lost, go back to main menu
      router.push("/");
    }
  }, [
    router,
    winner,
    playerId,
    cpuId,
    roundCount,
    difficulty,
    previousOpponents,
  ]);

  // Handle countdown timer
  useEffect(() => {
    if (!isCountingDown) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          startNextRound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCountingDown, startNextRound]);

  // Blink effect for continue text
  useEffect(() => {
    const interval = setInterval(() => {
      setShowContinue((prev) => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        impact("medium");
        startNextRound();
      } else if (e.key === "Escape") {
        impact("light");
        router.push("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, startNextRound, impact]);

  const winnerText =
    winner === "player" ? "Du hast gewonnen!" : "Du hast verloren!";

  // Determine which fighter won and which lost
  const winnerFighter = winner === "player" ? playerFighter : cpuFighter;
  const loserFighter = winner === "player" ? cpuFighter : playerFighter;

  // Get the appropriate sprite based on win/lose state
  const spriteToShow =
    winner === "player"
      ? winnerFighter.wonSprite || "/images/victory.png"
      : loserFighter.lostSprite || "/images/defeat.png";

  // Get the appropriate background and text color based on win/lose state
  const backgroundImage =
    winner === "player" ? "/images/youwon.jpg" : "/images/youlost.jpg";
  const titleColor = winner === "player" ? "#5D1A11" : "#361E13";

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-[#001428] pixelated">
        <Image
          src={backgroundImage || "/placeholder.svg"}
          alt={winner === "player" ? "Victory Background" : "Defeat Background"}
          fill
          className="object-cover pixelated"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="z-10 flex flex-col items-center justify-between h-full py-6 sm:py-12 px-4">
        <h1
          className="game-title text-3xl sm:text-4xl lg:text-6xl text-center"
          style={{ color: titleColor }}
        >
          {winnerText}
        </h1>

        <div className="flex-grow flex items-end justify-center">
          {/* Position sprite at the bottom */}
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 flex items-end justify-center">
            <Image
              src={spriteToShow || "/placeholder.svg"}
              alt={
                winner === "player" ? "Victorious Fighter" : "Defeated Fighter"
              }
              width={200}
              height={200}
              className="pixelated object-contain object-bottom"
              unoptimized
            />
          </div>
        </div>

        <div className="flex flex-col items-center mt-4 sm:mt-8 gap-3 sm:gap-4 w-full max-w-md pb-safe">
          <button
            onClick={startNextRound}
            onTouchStart={startNextRound}
            className={`game-text text-sm sm:text-base lg:text-xl cursor-pointer bg-black/60 py-2 sm:py-3 px-4 sm:px-6 rounded border-2 border-gray-600 active:border-orange-500 active:scale-95 transition-all touch-manipulation w-full ${
              showContinue ? "blink" : "opacity-0"
            }`}
          >
            {winner === "player" ? "NÄCHSTE RUNDE" : "NOCHMAL SPIELEN"}
          </button>

          {winner === "player" && (
            <button
              onClick={() => router.push("/")}
              onTouchStart={() => router.push("/")}
              className="game-text text-xs sm:text-sm lg:text-lg cursor-pointer bg-black/60 py-2 px-3 sm:px-4 rounded border-2 border-gray-600 active:border-orange-500 active:scale-95 transition-all touch-manipulation w-full"
              style={{ color: "#5D1A11" }}
            >
              HAUPTMENÜ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
