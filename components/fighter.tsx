"use client";

import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import type { Fighter as FighterType } from "@/lib/fighters";

interface FighterProps {
  fighter: FighterType;
  position: number;
  state: string;
  side: "left" | "right";
  jumpDirection?: "left" | "right" | null;
  isDefending?: boolean;
  isFacingLeft?: boolean;
  isDefeated?: boolean;
  isVictorious?: boolean;
  isHit?: boolean;
  isWalking?: boolean;
  isJumpKicking?: boolean;
}

export function Fighter({
  fighter,
  position,
  state,
  side,
  jumpDirection,
  isDefending = false,
  isFacingLeft = false,
  isDefeated = false,
  isVictorious = false,
  isHit = false,
  isWalking = false,
  isJumpKicking = false,
}: FighterProps) {
  // Add state for walking animation
  const [showWalkFrame, setShowWalkFrame] = useState(false);

  // Walking animation effect - optimized with requestAnimationFrame
  useEffect(() => {
    if (!isWalking || !fighter.walkSprite) return;

    let animationId: number;
    let lastToggle = 0;

    const animate = (timestamp: number) => {
      if (timestamp - lastToggle >= 150) {
        setShowWalkFrame((prev) => !prev);
        lastToggle = timestamp;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isWalking, fighter.walkSprite]);

  // Check if fighter uses a single sprite or a sprite sheet
  const isSingleSprite = fighter.useSingleSprite;

  // Determine z-index based on victory/defeat state
  // Victorious fighters should appear in front of defeated fighters
  const zIndex = isVictorious ? 20 : isDefeated ? 5 : 10;

  // Memoized sprite selection for single sprites
  const spriteToUse = useMemo(() => {
    if (!isSingleSprite) return fighter.sprite;

    if (isDefeated && fighter.lostSprite) return fighter.lostSprite;
    if (isVictorious && fighter.wonSprite) return fighter.wonSprite;
    if (isHit && !isDefending && fighter.hitSprite) return fighter.hitSprite;
    if (state === "punch" && fighter.punchSprite) return fighter.punchSprite;
    if (state === "kick" && fighter.kickSprite) return fighter.kickSprite;
    if (state === "jump") {
      if (isJumpKicking && fighter.kickSprite) return fighter.kickSprite;
      return fighter.jumpSprite || fighter.sprite;
    }
    if ((state === "defence" || isDefending) && fighter.defenceSprite)
      return fighter.defenceSprite;
    if (state === "duck" && fighter.duckSprite) return fighter.duckSprite;
    if (isWalking && fighter.walkSprite && showWalkFrame)
      return fighter.walkSprite;
    return fighter.sprite;
  }, [
    isSingleSprite,
    fighter,
    state,
    isDefeated,
    isVictorious,
    isHit,
    isDefending,
    isJumpKicking,
    isWalking,
    showWalkFrame,
  ]);

  // Memoized flip calculation
  const shouldFlip = useMemo(
    () =>
      (side === "left" && isFacingLeft) || (side === "right" && !isFacingLeft),
    [side, isFacingLeft],
  );

  // For single sprites, we need to use Image component for better compatibility
  if (isSingleSprite) {
    return (
      <div
        className="absolute fighter-container"
        style={{
          left: side === "left" ? `${position}px` : "auto",
          right: side === "right" ? `${position}px` : "auto",
          bottom: state === "jump" ? "100px" : "0px",
          transition:
            state === "jump"
              ? "bottom 0.45s cubic-bezier(0.4, 0, 0.2, 1), left 0.3s, right 0.3s"
              : "bottom 0.25s ease-out",
          zIndex: zIndex,
          transform: shouldFlip ? "scaleX(-1)" : "",
          willChange: "transform, bottom",
        }}
      >
        <div className="relative w-full h-full">
          <Image
            src={spriteToUse || "/placeholder.svg"}
            alt={fighter.name}
            fill
            className="pixelated object-contain object-bottom"
            priority
            loading="eager"
            quality={100}
            unoptimized
            sizes="(max-width: 480px) 100px, (max-width: 768px) 120px, 160px"
          />
        </div>
      </div>
    );
  }

  // For sprite sheets, calculate the position based on state - memoized
  const spritePosition = useMemo(() => {
    switch (state) {
      case "idle":
        return { x: 0, y: 0 };
      case "punch":
        return { x: 80, y: 0 };
      case "kick":
        return { x: 240, y: 0 };
      case "duck":
        return { x: 0, y: 80 };
      case "jump":
        return { x: 160, y: 80 };
      case "defence":
        return { x: 160, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  }, [state]);

  const spriteSheetFlip = useMemo(
    () =>
      (side === "right" && !isFacingLeft) || (side === "left" && isFacingLeft),
    [side, isFacingLeft],
  );

  return (
    <div
      className="absolute fighter-container"
      style={{
        left: side === "left" ? `${position}px` : "auto",
        right: side === "right" ? `${position}px` : "auto",
        bottom: state === "jump" ? "100px" : "0px",
        transition:
          state === "jump"
            ? "bottom 0.45s cubic-bezier(0.4, 0, 0.2, 1), left 0.3s, right 0.3s"
            : "bottom 0.25s ease-out",
        zIndex: zIndex,
        willChange: "transform, bottom",
      }}
    >
      <div
        className={`relative w-full h-full ${spriteSheetFlip ? "scale-x-[-1]" : ""}`}
        style={{
          transform:
            state === "punch"
              ? `${side === "right" ? "translateX(-15px)" : "translateX(15px)"}`
              : "none",
          transition: "transform 0.12s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          className="w-full h-full pixelated"
          style={{
            backgroundImage: `url(${fighter.sprite})`,
            backgroundPosition: `-${spritePosition.x}px -${spritePosition.y}px`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "320px 240px", // 4x3 grid of 80x80 sprites
          }}
        />
      </div>
    </div>
  );
}
