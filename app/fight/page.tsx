"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fighters } from "@/lib/fighters";
import { useKeyboardControls } from "@/hooks/use-keyboard-controls";
import { FightControls } from "@/components/fight-controls";
import { MobileControls } from "@/components/mobile-controls";
import { PowerBar } from "@/components/power-bar";
import { Fighter } from "@/components/fighter";
import { getRandomFighter } from "@/lib/game-utils";
import { getStageBackgroundByRound } from "@/lib/stage-utils";
import { useSoundContext } from "@/components/sound-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTelegramHaptic } from "@/lib/telegram";

export default function FightScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const playerId = searchParams.get("player") || fighters[0].id;
  const playerFighter = fighters.find((f) => f.id === playerId) || fighters[0];
  const { setCurrentTrack } = useSoundContext();
  const isMobile = useIsMobile();
  const { impact } = useTelegramHaptic();

  // Get round number and difficulty from URL
  const roundCount = Number.parseInt(searchParams.get("round") || "1", 10);
  const difficulty = Number.parseFloat(searchParams.get("difficulty") || "1.0");

  // Get previous opponents from URL
  const previousOpponentsParam = searchParams.get("prevOpponents") || "";
  const previousOpponents = previousOpponentsParam
    ? previousOpponentsParam.split(",")
    : [];

  // Initialize CPU fighter with useState - start with first fighter to avoid hydration mismatch
  const [cpuFighter, setCpuFighter] = useState(fighters[0]);
  const cpuFighterInitialized = useRef(false);

  // Initialize stage background with useState to avoid hydration mismatch
  const [stageBackground, setStageBackground] = useState<string>("");

  // Set CPU fighter and stage background only on client side (once)
  useEffect(() => {
    if (!cpuFighterInitialized.current) {
      setCpuFighter(getRandomFighter(playerId, previousOpponents));
      cpuFighterInitialized.current = true;
    }
    setStageBackground(getStageBackgroundByRound(roundCount));
  }, []); // Empty dependency array - only run once

  const [playerHealth, setPlayerHealth] = useState(100);
  const [cpuHealth, setCpuHealth] = useState(100);
  const [playerPosition, setPlayerPosition] = useState(150); // 150px from left edge
  const [cpuPosition, setCpuPosition] = useState(150); // 150px from right edge
  const [playerState, setPlayerState] = useState<
    "idle" | "punch" | "kick" | "jump" | "duck" | "defence"
  >("idle");
  const [cpuState, setCpuState] = useState<
    "idle" | "punch" | "kick" | "jump" | "duck" | "defence"
  >("idle");
  const [playerJumpDirection, setPlayerJumpDirection] = useState<
    "left" | "right" | null
  >(null);
  const [isPlayerDefending, setIsPlayerDefending] = useState(false);
  const [isPlayerFacingLeft, setIsPlayerFacingLeft] = useState(false);
  const [isCpuFacingLeft, setIsCpuFacingLeft] = useState(true); // Start facing left (towards player)
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<"player" | "cpu" | null>(null);

  // Add state for tracking when fighters are hit
  const [isPlayerHit, setIsPlayerHit] = useState(false);
  const [isCpuHit, setIsCpuHit] = useState(false);

  // Add state for walking animation
  const [isPlayerWalking, setIsPlayerWalking] = useState(false);
  const [isCpuWalking, setIsCpuWalking] = useState(false);

  // Add state to track if jump key was just pressed
  const [jumpKeyPressed, setJumpKeyPressed] = useState(false);

  // Add state for jump kicking
  const [isPlayerJumpKicking, setIsPlayerJumpKicking] = useState(false);

  // Add state to track player's last action for CPU to react
  const [playerLastAction, setPlayerLastAction] = useState<
    "idle" | "punch" | "kick" | "jump" | "duck" | "defence" | "jumpKick"
  >("idle");

  // Add state to track CPU movement
  const [cpuMovementTimer, setCpuMovementTimer] = useState(0);
  const [cpuIdleTime, setCpuIdleTime] = useState(0);
  const [cpuAttackCooldown, setCpuAttackCooldown] = useState(false);

  // Track key press for single tap movement
  const [arrowLeftPressed, setArrowLeftPressed] = useState(false);
  const [arrowRightPressed, setArrowRightPressed] = useState(false);

  const gameLoopRef = useRef<number | null>(null);
  const cpuMovementRef = useRef<number | null>(null);
  const lastCpuActionRef = useRef(Date.now());
  const movementIntervalRef = useRef<number | null>(null);
  const hitCooldownRef = useRef(false);

  // Set up keyboard controls
  const { isKeyDown, resetKeys } = useKeyboardControls();

  // Mobile touch controls state
  const [touchControls, setTouchControls] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
    punch: false,
    kick: false,
    defence: false,
  });

  // Handle mobile control actions
  const handleMobileAction = (action: string, isPressed: boolean) => {
    setTouchControls((prev) => ({
      ...prev,
      [action]: isPressed,
    }));
  };

  // Combine keyboard and touch controls
  const isControlActive = (control: string) => {
    if (isMobile) {
      return (touchControls as any)[control] || false;
    }
    // Map touch control names to keyboard keys
    const keyMap: Record<string, keyof typeof isKeyDown> = {
      up: "ArrowUp",
      down: "ArrowDown",
      left: "ArrowLeft",
      right: "ArrowRight",
      punch: "d",
      kick: "a",
      defence: "s",
    };
    return isKeyDown[keyMap[control]] || false;
  };

  // Calculate actual positions for hit detection - slightly reduced hit area
  const getPlayerCenterX = () => playerPosition + 70;
  const getCpuCenterX = () => window.innerWidth - cpuPosition - 70;

  // Fighter collision detection - define collision boxes
  const FIGHTER_WIDTH = 100; // Width of fighter collision box
  const PLAYER2_FIGHTER_WIDTH = 90; // Slightly smaller hit area for Player 2

  // Check if fighters are colliding
  const checkCollision = () => {
    // Only check collision when both fighters are on the ground (not jumping)
    if (playerState === "jump" || cpuState === "jump") {
      return false;
    }

    const playerRight = playerPosition + FIGHTER_WIDTH;
    const cpuLeft = window.innerWidth - cpuPosition - PLAYER2_FIGHTER_WIDTH;

    // If player's right edge is past CPU's left edge, they're colliding
    return playerRight >= cpuLeft;
  };

  // Handle single tap movement for player
  useEffect(() => {
    const leftActive = isControlActive("left");
    const rightActive = isControlActive("right");

    // Handle single tap for left arrow
    if (
      leftActive &&
      !arrowLeftPressed &&
      playerState !== "jump" &&
      playerState !== "defence" &&
      playerState !== "duck"
    ) {
      setArrowLeftPressed(true);
      setIsPlayerFacingLeft(true);
      // Set walking animation when moving
      setIsPlayerWalking(true);

      // Calculate new position
      const newPosition = Math.max(playerPosition - 20, 50);

      // Check if this movement would cause collision
      const playerRight = newPosition + FIGHTER_WIDTH;
      const cpuLeft = window.innerWidth - cpuPosition - PLAYER2_FIGHTER_WIDTH;

      // Only move if it won't cause collision
      if (playerRight < cpuLeft) {
        setPlayerPosition(newPosition);
      }
    }
    if (!leftActive && arrowLeftPressed) {
      setArrowLeftPressed(false);
      // Stop walking animation if both movement keys are up
      if (!rightActive) setIsPlayerWalking(false);
    }

    // Handle single tap for right arrow
    if (
      rightActive &&
      !arrowRightPressed &&
      playerState !== "jump" &&
      playerState !== "defence" &&
      playerState !== "duck"
    ) {
      setArrowRightPressed(true);
      setIsPlayerFacingLeft(false);
      // Set walking animation when moving
      setIsPlayerWalking(true);

      // Calculate new position
      const newPosition = Math.min(
        playerPosition + 20,
        window.innerWidth - 150
      );

      // Check if this movement would cause collision
      const playerRight = newPosition + FIGHTER_WIDTH;
      const cpuLeft = window.innerWidth - cpuPosition - PLAYER2_FIGHTER_WIDTH;

      // Only move if it won't cause collision
      if (playerRight < cpuLeft) {
        setPlayerPosition(newPosition);
      }
    }
    if (!rightActive && arrowRightPressed) {
      setArrowRightPressed(false);
      // Stop walking animation if both movement keys are up
      if (!leftActive) setIsPlayerWalking(false);
    }
  }, [
    touchControls,
    isKeyDown.ArrowLeft,
    isKeyDown.ArrowRight,
    arrowLeftPressed,
    arrowRightPressed,
    playerState,
    playerPosition,
    cpuPosition,
    isMobile,
  ]);

  // Set background music for fight screen
  useEffect(() => {
    if (stageBackground === "/images/stages/stage-1.png") {
      setCurrentTrack("/Furz-Symphonie.mp3");
    } else if (stageBackground === "/images/stages/stage-2.png") {
      setCurrentTrack("/Der Furzsong2.mp3");
    } else if (stageBackground === "/images/stages/stage3.png") {
      setCurrentTrack("/Der Furzsong.mp3");
    }
  }, [stageBackground, setCurrentTrack]);

  // CPU movement logic - separate from main game loop for more frequent movement
  useEffect(() => {
    if (gameOver) return;

    // CPU movement loop - runs more frequently than the main game loop
    cpuMovementRef.current = window.setInterval(() => {
      // Don't move if CPU is in the middle of an action
      if (cpuState !== "idle") return;

      // Get positions for calculations
      const cpuCenterX = getCpuCenterX();
      const playerCenterX = getPlayerCenterX();

      // Always update CPU facing direction based on player position
      // CPU should face left when player is to the left
      setIsCpuFacingLeft(cpuCenterX < playerCenterX);

      // Check if player is nearby for attack
      const isPlayerNearby = Math.abs(cpuCenterX - playerCenterX) < 170;

      // If player is nearby and not on cooldown, attempt to attack
      if (isPlayerNearby && !cpuAttackCooldown && cpuState === "idle") {
        const attackChance = Math.random();

        if (attackChance < 0.6) {
          // 60% chance to attack when close
          setCpuAttackCooldown(true);
          // Stop walking animation during attack
          setIsCpuWalking(false);

          // Choose attack type
          if (attackChance < 0.3) {
            // Punch
            setCpuState("punch");

            // Check if hit - CANNOT hit jumping player with punch
            // If player is defending, they take reduced damage (1%)
            if (
              Math.abs(cpuCenterX - playerCenterX) < 140 &&
              playerState !== "jump" &&
              !hitCooldownRef.current &&
              // CPU must be facing the player to hit
              ((cpuCenterX < playerCenterX && isCpuFacingLeft) ||
                (cpuCenterX > playerCenterX && !isCpuFacingLeft))
            ) {
              // If player is defending, they take reduced damage (1%)
              if (playerState === "defence") {
                setPlayerHealth((prev) => Math.max(0, prev - 1)); // 1% damage when defending
                // Don't set isPlayerHit when defending - keep defense sprite
              } else {
                // Apply difficulty multiplier to damage
                const damageMultiplier = difficulty;
                setPlayerHealth((prev) =>
                  Math.max(0, prev - Math.round(5 * damageMultiplier))
                ); // Scaled damage
                setIsPlayerHit(true);
                setTimeout(() => setIsPlayerHit(false), 300);
              }

              hitCooldownRef.current = true;
              setTimeout(() => {
                hitCooldownRef.current = false;
              }, 500);

              if (
                playerHealth -
                  (playerState === "defence"
                    ? 1
                    : Math.round(5 * difficulty)) <=
                0
              ) {
                endGame("cpu");
              }
            }

            setTimeout(() => {
              setCpuState("idle");
              setTimeout(() => setCpuAttackCooldown(false), 300); // Short cooldown after attack
            }, 300);
          } else if (attackChance < 0.5) {
            // Kick
            setCpuState("kick");

            // Check if hit - CANNOT hit ducking player with kick
            // If player is defending, they take reduced damage (1%)
            if (
              Math.abs(cpuCenterX - playerCenterX) < 170 &&
              playerState !== "jump" &&
              playerState !== "duck" && // Added check for ducking
              !hitCooldownRef.current &&
              // CPU must be facing the player to hit
              ((cpuCenterX < playerCenterX && isCpuFacingLeft) ||
                (cpuCenterX > playerCenterX && !isCpuFacingLeft))
            ) {
              // If player is defending, they take reduced damage (1%)
              if (playerState === "defence") {
                setPlayerHealth((prev) => Math.max(0, prev - 1)); // 1% damage when defending
                // Don't set isPlayerHit when defending - keep defense sprite
              } else {
                // Apply difficulty multiplier to damage
                const damageMultiplier = difficulty;
                setPlayerHealth((prev) =>
                  Math.max(0, prev - Math.round(10 * damageMultiplier))
                ); // Scaled damage
                setIsPlayerHit(true);
                setTimeout(() => setIsPlayerHit(false), 300);
              }

              hitCooldownRef.current = true;
              setTimeout(() => {
                hitCooldownRef.current = false;
              }, 500);

              if (
                playerHealth -
                  (playerState === "defence"
                    ? 1
                    : Math.round(10 * difficulty)) <=
                0
              ) {
                endGame("cpu");
              }
            }

            setTimeout(() => {
              setCpuState("idle");
              setTimeout(() => setCpuAttackCooldown(false), 400); // Medium cooldown after attack
            }, 400);
          } else {
            // Defence - CPU occasionally defends
            setCpuState("defence");
            setTimeout(() => {
              setCpuState("idle");
              setTimeout(() => setCpuAttackCooldown(false), 500);
            }, 500);
          }

          // Reset idle time when attacking
          setCpuIdleTime(0);
          return;
        }
      }

      // Increment idle time counter
      setCpuIdleTime((prev) => prev + 1);

      // If CPU has been idle for too long, force movement
      if (cpuIdleTime > 3) {
        // Reduced from 5 to 3 to make CPU move more
        // Move towards player
        setCpuPosition((prev) => {
          const direction = cpuCenterX > playerCenterX ? 1 : -1;
          // Set walking animation when moving
          setIsCpuWalking(true);

          // Calculate new position
          const newPosition = Math.max(
            50,
            Math.min(window.innerWidth - 150, prev + direction * 15)
          );

          // Check if this movement would cause collision
          const playerRight = playerPosition + FIGHTER_WIDTH;
          const cpuLeft =
            window.innerWidth - newPosition - PLAYER2_FIGHTER_WIDTH;

          // Only move if it won't cause collision
          if (playerRight < cpuLeft) {
            return newPosition;
          }
          return prev;
        });

        // Reset idle time
        setCpuIdleTime(0);
        return;
      }

      // Random movement chance (higher probability - increased from 0.3 to 0.5)
      if (Math.random() < 0.5) {
        // Move towards player
        setCpuPosition((prev) => {
          const direction = cpuCenterX > playerCenterX ? 1 : -1;
          // Set walking animation when moving
          setIsCpuWalking(true);

          // Calculate new position
          const newPosition = Math.max(
            50,
            Math.min(window.innerWidth - 150, prev + direction * 15)
          );

          // Check if this movement would cause collision
          const playerRight = playerPosition + FIGHTER_WIDTH;
          const cpuLeft =
            window.innerWidth - newPosition - PLAYER2_FIGHTER_WIDTH;

          // Only move if it won't cause collision or CPU is jumping
          if (cpuState === "jump" || playerRight < cpuLeft) {
            return newPosition;
          }
          return prev;
        });

        // Reset idle time when moving
        setCpuIdleTime(0);
      } else {
        // Stop walking animation when not moving
        setIsCpuWalking(false);
      }

      // Random duck or jump (lower probability)
      if (Math.random() < 0.1 && cpuState === "idle") {
        // Stop walking animation during action
        setIsCpuWalking(false);

        if (Math.random() < 0.5) {
          setCpuState("duck");
          setTimeout(() => setCpuState("idle"), 400);
        } else {
          setCpuState("jump");
          setTimeout(() => setCpuState("idle"), 500);
        }
        // Reset idle time when performing an action
        setCpuIdleTime(0);
      }

      // Increment movement timer
      setCpuMovementTimer((prev) => prev + 1);
    }, 200); // Check for movement every 200ms

    return () => {
      if (cpuMovementRef.current) clearInterval(cpuMovementRef.current);
    };
  }, [
    cpuState,
    cpuIdleTime,
    gameOver,
    playerState,
    playerHealth,
    cpuAttackCooldown,
    playerPosition,
    cpuPosition,
    isCpuFacingLeft,
    difficulty,
  ]);

  // Game loop for CPU AI decisions
  useEffect(() => {
    if (gameOver) return;

    // CPU AI
    gameLoopRef.current = window.setInterval(() => {
      // Adjust reaction time based on difficulty (faster reactions at higher difficulty)
      const reactionTime = Math.max(500 - (difficulty - 1) * 100, 200);
      if (Date.now() - lastCpuActionRef.current < reactionTime) return;

      // Regular CPU actions
      const action = Math.random();

      // Update CPU facing direction based on player position
      const cpuCenterX = getCpuCenterX();
      const playerCenterX = getPlayerCenterX();

      // CPU should face left when player is to the left
      setIsCpuFacingLeft(cpuCenterX < playerCenterX);

      // React to player's last action
      if (playerLastAction === "kick" && cpuState === "idle" && action < 0.7) {
        // Stop walking animation during action
        setIsCpuWalking(false);

        // Duck to dodge kicks
        setCpuState("duck");
        setTimeout(() => setCpuState("idle"), 400);
        lastCpuActionRef.current = Date.now();
        setCpuIdleTime(0); // Reset idle time
        return;
      }

      if (playerLastAction === "punch" && cpuState === "idle" && action < 0.7) {
        // Stop walking animation during action
        setIsCpuWalking(false);

        // Jump to dodge punches
        setCpuState("jump");
        setTimeout(() => setCpuState("idle"), 500);
        lastCpuActionRef.current = Date.now();
        setCpuIdleTime(0); // Reset idle time
        return;
      }

      // Sometimes use defence when player is attacking
      if (
        (playerLastAction === "punch" || playerLastAction === "kick") &&
        cpuState === "idle" &&
        action < 0.4
      ) {
        // Stop walking animation during action
        setIsCpuWalking(false);

        setCpuState("defence");
        setTimeout(() => {
          setCpuState("idle");
          setTimeout(() => setCpuAttackCooldown(false), 500);
        }, 500);
        lastCpuActionRef.current = Date.now();
        setCpuIdleTime(0); // Reset idle time
        return;
      }

      lastCpuActionRef.current = Date.now();
    }, 500); // Faster AI thinking

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (movementIntervalRef.current)
        clearInterval(movementIntervalRef.current);
    };
  }, [
    playerPosition,
    cpuPosition,
    playerState,
    cpuState,
    playerHealth,
    cpuHealth,
    gameOver,
    playerLastAction,
    difficulty,
  ]);

  // Handle continuous movement when keys are held down for player
  useEffect(() => {
    if (gameOver) return;

    const rightActive = isControlActive("right");
    const leftActive = isControlActive("left");

    // Clear any existing movement interval
    if (movementIntervalRef.current) {
      clearInterval(movementIntervalRef.current);
      movementIntervalRef.current = null;
    }

    // Handle movement and direction
    if ((rightActive || leftActive) && playerState !== "duck") {
      // Set walking animation when moving
      if (playerState === "idle") setIsPlayerWalking(true);

      // Set up continuous movement
      movementIntervalRef.current = window.setInterval(() => {
        if (
          rightActive &&
          playerState !== "jump" &&
          playerState !== "defence" &&
          playerState !== "duck"
        ) {
          // Calculate new position
          const newPosition = Math.min(
            playerPosition + 10,
            window.innerWidth - 150
          );

          // Check if this movement would cause collision
          const playerRight = newPosition + FIGHTER_WIDTH;
          const cpuLeft =
            window.innerWidth - cpuPosition - PLAYER2_FIGHTER_WIDTH;

          // Only move if it won't cause collision
          if (playerRight < cpuLeft) {
            setPlayerPosition(newPosition);
          }
        } else if (
          leftActive &&
          playerState !== "jump" &&
          playerState !== "defence" &&
          playerState !== "duck"
        ) {
          setPlayerPosition((prev) => Math.max(prev - 10, 50));
        }
      }, 50); // Move every 50ms for smoother continuous movement
    } else {
      // Stop walking animation when not moving
      setIsPlayerWalking(false);
    }

    return () => {
      if (movementIntervalRef.current) {
        clearInterval(movementIntervalRef.current);
        movementIntervalRef.current = null;
      }
    };
  }, [
    touchControls,
    isKeyDown.ArrowRight,
    isKeyDown.ArrowLeft,
    gameOver,
    playerState,
    playerPosition,
    cpuPosition,
    isMobile,
  ]);

  // Handle jump with direction - only jump once per key press
  useEffect(() => {
    if (gameOver) return;

    const upActive = isControlActive("up");
    const downActive = isControlActive("down");
    const leftActive = isControlActive("left");
    const rightActive = isControlActive("right");
    const punchActive = isControlActive("punch");
    const kickActive = isControlActive("kick");
    const defenceActive = isControlActive("defence");

    // Handle jump key press
    if (upActive && playerState === "idle" && !jumpKeyPressed) {
      impact("light");
      setJumpKeyPressed(true);
      setPlayerLastAction("jump");
      // Stop walking animation during jump
      setIsPlayerWalking(false);

      // Determine jump direction
      let direction: "left" | "right" | null = null;

      if (leftActive) {
        direction = "left";
        setIsPlayerFacingLeft(true);
        // Move left while jumping
        setPlayerPosition((prev) => Math.max(prev - 50, 50));
      } else if (rightActive) {
        direction = "right";
        setIsPlayerFacingLeft(false);
        // Move right while jumping
        setPlayerPosition((prev) =>
          Math.min(prev + 50, window.innerWidth - 150)
        );
      }

      setPlayerJumpDirection(direction);
      setPlayerState("jump");

      setTimeout(() => {
        setPlayerState("idle");
        setPlayerJumpDirection(null);
        setPlayerLastAction("idle");
        setIsPlayerJumpKicking(false);
      }, 500);
    }

    // Reset jump key pressed state when key is released
    if (!upActive && jumpKeyPressed) {
      setJumpKeyPressed(false);
    }

    if (downActive && playerState === "idle") {
      setPlayerState("duck");
      setPlayerLastAction("duck");
      // Stop walking animation during duck
      setIsPlayerWalking(false);
    } else if (!downActive && playerState === "duck") {
      setPlayerState("idle");
      setPlayerLastAction("idle");
    }

    if (punchActive && playerState === "idle") {
      impact("light");
      setPlayerState("punch");
      setPlayerLastAction("punch");
      // Stop walking animation during punch
      setIsPlayerWalking(false);

      // Check if hit - improved hit detection with slightly reduced area
      const cpuCenterX = getCpuCenterX();
      const playerCenterX = getPlayerCenterX();

      // Only allow hits when player is close to CPU and facing the right direction
      if (
        Math.abs(cpuCenterX - playerCenterX) < 140 && // Reduced hit area
        cpuState !== "jump" && // Can't hit jumping CPU (dodge)
        !hitCooldownRef.current &&
        // Player must be facing the CPU to hit
        ((playerCenterX < cpuCenterX && !isPlayerFacingLeft) ||
          (playerCenterX > cpuCenterX && isPlayerFacingLeft))
      ) {
        // If CPU is defending, they take reduced damage (1%)
        if (cpuState === "defence") {
          impact("medium");
          setCpuHealth((prev) => Math.max(0, prev - 1)); // 1% damage when defending
          // Don't set isCpuHit when defending - keep defense sprite
        } else {
          impact("heavy");
          setCpuHealth((prev) => Math.max(0, prev - 5)); // Normal damage
          setIsCpuHit(true);
          setTimeout(() => setIsCpuHit(false), 300);
        }

        hitCooldownRef.current = true;
        setTimeout(() => {
          hitCooldownRef.current = false;
        }, 500);

        if (cpuHealth - (cpuState === "defence" ? 1 : 5) <= 0) {
          endGame("player");
        }
      }

      setTimeout(() => {
        setPlayerState("idle");
        setPlayerLastAction("idle");
      }, 300);
      if (!isMobile) resetKeys(["d"]);
    }

    // Handle kick - now works both on ground and in air
    if (kickActive && (playerState === "idle" || playerState === "jump")) {
      impact("light");
      // If in air, do a jump kick, otherwise do a regular kick
      const isJumpKick = playerState === "jump";

      if (isJumpKick) {
        setPlayerLastAction("jumpKick");
        setIsPlayerJumpKicking(true);
      } else {
        setPlayerState("kick");
        setPlayerLastAction("kick");
        // Stop walking animation during kick
        setIsPlayerWalking(false);
      }

      // Check if hit - improved hit detection with slightly reduced area
      const cpuCenterX = getCpuCenterX();
      const playerCenterX = getPlayerCenterX();

      // Only allow hits when player is close to CPU and facing the right direction
      if (
        Math.abs(cpuCenterX - playerCenterX) < 170 && // Reduced hit area
        cpuState !== "jump" && // Can't hit jumping CPU
        (isJumpKick || cpuState !== "duck") && // Regular kick can't hit ducking CPU, but jump kick can
        !hitCooldownRef.current &&
        // Player must be facing the CPU to hit
        ((playerCenterX < cpuCenterX && !isPlayerFacingLeft) ||
          (playerCenterX > cpuCenterX && isPlayerFacingLeft))
      ) {
        // If CPU is defending, they take reduced damage (1%)
        if (cpuState === "defence") {
          impact("medium");
          setCpuHealth((prev) => Math.max(0, prev - 1)); // 1% damage when defending
          // Don't set isCpuHit when defending - keep defense sprite
        } else {
          impact("heavy");
          // Jump kicks do more damage
          const damage = isJumpKick ? 15 : 10;
          setCpuHealth((prev) => Math.max(0, prev - damage)); // Normal damage
          setIsCpuHit(true);
          setTimeout(() => setIsCpuHit(false), 300);
        }

        hitCooldownRef.current = true;
        setTimeout(() => {
          hitCooldownRef.current = false;
        }, 500);

        const damageDealt = cpuState === "defence" ? 1 : isJumpKick ? 15 : 10;
        if (cpuHealth - damageDealt <= 0) {
          endGame("player");
        }
      }

      if (!isJumpKick) {
        setTimeout(() => {
          setPlayerState("idle");
          setPlayerLastAction("idle");
        }, 400);
      }
      if (!isMobile) resetKeys(["a"]);
    }

    // Handle defence with S key
    if (defenceActive && playerState === "idle") {
      impact("rigid");
      setPlayerState("defence");
      setPlayerLastAction("defence");
      setIsPlayerDefending(true);
      // Stop walking animation during defence
      setIsPlayerWalking(false);

      setTimeout(() => {
        setPlayerState("idle");
        setPlayerLastAction("idle");
        setIsPlayerDefending(false);
      }, 500);
      if (!isMobile) resetKeys(["s"]);
    }
  }, [
    touchControls,
    isKeyDown.ArrowUp,
    isKeyDown.ArrowDown,
    isKeyDown.ArrowLeft,
    isKeyDown.ArrowRight,
    isKeyDown.d,
    isKeyDown.a,
    isKeyDown.s,
    playerPosition,
    cpuPosition,
    playerState,
    cpuState,
    playerHealth,
    cpuHealth,
    gameOver,
    resetKeys,
    jumpKeyPressed,
    isPlayerFacingLeft,
    isMobile,
  ]);

  const endGame = (winner: "player" | "cpu") => {
    setGameOver(true);
    setWinner(winner);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (cpuMovementRef.current) clearInterval(cpuMovementRef.current);
    if (movementIntervalRef.current) clearInterval(movementIntervalRef.current);

    // Navigate to winner screen after a delay
    setTimeout(() => {
      router.push(
        `/winner?winner=${winner}&player=${playerId}&cpu=${
          cpuFighter.id
        }&round=${roundCount}&difficulty=${difficulty.toFixed(
          1
        )}&prevOpponents=${previousOpponentsParam}`
      );
    }, 2000);
  };

  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{ height: "100dvh", minHeight: "-webkit-fill-available" }}
    >
      {/* Background - full screen */}
      {stageBackground && (
        <img
          src={stageBackground}
          alt="Fight Stage"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            zIndex: 0,
          }}
        />
      )}

      {/* Gameplay Area - Top 70% */}
      <div
        className="gameplay-area relative w-full flex flex-col"
        style={{
          height: "70%",
          minHeight: "70%",
          maxHeight: "70%",
        }}
      >
        {/* Health bars - top of gameplay area */}
        <div
          className="w-full px-2 sm:px-4 md:px-8 flex justify-between gap-2 sm:gap-4 z-20"
          style={{
            paddingTop: "max(10px, env(safe-area-inset-top))",
            paddingBottom: "10px",
          }}
        >
          <PowerBar health={playerHealth} name={playerFighter.name} />
          <PowerBar health={cpuHealth} name={cpuFighter.name} reversed />
        </div>

        {/* Fight arena - main gameplay space */}
        <div className="relative flex-1 w-full overflow-hidden">
          {/* Player fighter */}
          <Fighter
            fighter={playerFighter}
            position={playerPosition}
            state={playerState}
            side="left"
            jumpDirection={playerJumpDirection}
            isDefending={isPlayerDefending || playerState === "defence"}
            isFacingLeft={isPlayerFacingLeft}
            isDefeated={gameOver && winner === "cpu"}
            isVictorious={gameOver && winner === "player"}
            isHit={isPlayerHit}
            isWalking={isPlayerWalking && playerState === "idle"}
            isJumpKicking={isPlayerJumpKicking}
          />

          {/* CPU fighter */}
          <Fighter
            fighter={cpuFighter}
            position={cpuPosition}
            state={cpuState}
            side="right"
            isFacingLeft={isCpuFacingLeft}
            isDefeated={gameOver && winner === "player"}
            isVictorious={gameOver && winner === "cpu"}
            isHit={isCpuHit}
            isWalking={isCpuWalking && cpuState === "idle"}
          />
        </div>

        {/* Visual separator line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent z-10"
          style={{ boxShadow: "0 0 10px rgba(255, 140, 0, 0.5)" }}
        ></div>
      </div>

      {/* Controls Area - Bottom 30% */}
      <div
        className="controls-area relative w-full flex flex-col justify-center items-center"
        style={{
          height: "30%",
          minHeight: "30%",
          maxHeight: "30%",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
        }}
      >
        {/* Desktop controls help */}
        {!isMobile && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
            <FightControls />
          </div>
        )}

        {/* Mobile touch controls - fixed at bottom */}
        {isMobile && (
          <div className="w-full h-full flex items-center justify-center">
            <MobileControls onAction={handleMobileAction} />
          </div>
        )}
      </div>
    </div>
  );
}
