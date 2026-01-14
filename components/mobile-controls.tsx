"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface MobileControlsProps {
  onAction: (action: string, isPressed: boolean) => void;
}

interface JoystickState {
  isActive: boolean;
  position: { x: number; y: number };
  direction: { x: number; y: number };
}

export function MobileControls({ onAction }: MobileControlsProps) {
  const [activeButtons, setActiveButtons] = useState<Set<string>>(new Set());
  const [joystick, setJoystick] = useState<JoystickState>({
    isActive: false,
    position: { x: 0, y: 0 },
    direction: { x: 0, y: 0 },
  });

  const joystickRef = useRef<HTMLDivElement>(null);
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const activeTouchesRef = useRef<Map<number, string>>(new Map());

  // Joystick configuration
  const JOYSTICK_DEADZONE = 10;
  const JOYSTICK_MAX_DISTANCE = 45;
  const JOYSTICK_RETURN_SPEED = 0.3;

  // Enhanced haptic feedback
  const triggerHapticFeedback = useCallback(
    (intensity: "light" | "medium" | "heavy" = "light") => {
      if (!navigator.vibrate) return;

      const patterns = {
        light: 20,
        medium: [30, 10, 30],
        heavy: [50, 20, 50, 20, 50],
      };

      navigator.vibrate(patterns[intensity]);
    },
    []
  );

  // Handle button press with improved feedback
  const handleButtonStart = useCallback(
    (action: string, touchId?: number) => {
      setActiveButtons((prev) => new Set(prev).add(action));
      onAction(action, true);

      // Store touch ID for multi-touch support
      if (touchId !== undefined) {
        activeTouchesRef.current.set(touchId, action);
      }

      // Haptic feedback based on action type
      if (action === "punch" || action === "kick") {
        triggerHapticFeedback("medium");
      } else if (action === "defence") {
        triggerHapticFeedback("heavy");
      } else {
        triggerHapticFeedback("light");
      }
    },
    [onAction, triggerHapticFeedback]
  );

  const handleButtonEnd = useCallback(
    (action: string, touchId?: number) => {
      setActiveButtons((prev) => {
        const next = new Set(prev);
        next.delete(action);
        return next;
      });
      onAction(action, false);

      // Remove touch ID
      if (touchId !== undefined) {
        activeTouchesRef.current.delete(touchId);
      }
    },
    [onAction]
  );

  // Enhanced joystick handling
  const updateJoystick = useCallback(
    (clientX: number, clientY: number, isStart: boolean = false) => {
      if (!joystickBaseRef.current) return;

      const rect = joystickBaseRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let deltaX = clientX - centerX;
      let deltaY = clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Apply deadzone
      if (distance < JOYSTICK_DEADZONE) {
        deltaX = 0;
        deltaY = 0;
      }

      // Clamp to max distance
      const clampedDistance = Math.min(distance, JOYSTICK_MAX_DISTANCE);
      if (distance > 0) {
        deltaX = (deltaX / distance) * clampedDistance;
        deltaY = (deltaY / distance) * clampedDistance;
      }

      // Normalize direction for input
      const normalizedX =
        distance > JOYSTICK_DEADZONE ? deltaX / JOYSTICK_MAX_DISTANCE : 0;
      const normalizedY =
        distance > JOYSTICK_DEADZONE ? deltaY / JOYSTICK_MAX_DISTANCE : 0;

      setJoystick({
        isActive: isStart || distance >= JOYSTICK_DEADZONE,
        position: { x: deltaX, y: deltaY },
        direction: { x: normalizedX, y: normalizedY },
      });

      // Update directional controls based on joystick
      const wasLeft = activeButtons.has("left");
      const wasRight = activeButtons.has("right");
      const wasUp = activeButtons.has("up");
      const wasDown = activeButtons.has("down");

      const isLeft = normalizedX < -0.3;
      const isRight = normalizedX > 0.3;
      const isUp = normalizedY < -0.3;
      const isDown = normalizedY > 0.3;

      // Only trigger state changes, don't call onAction directly to avoid spam
      if (isLeft && !wasLeft) handleButtonStart("left");
      else if (!isLeft && wasLeft) handleButtonEnd("left");

      if (isRight && !wasRight) handleButtonStart("right");
      else if (!isRight && wasRight) handleButtonEnd("right");

      if (isUp && !wasUp) handleButtonStart("up");
      else if (!isUp && wasUp) handleButtonEnd("up");

      if (isDown && !wasDown) handleButtonStart("down");
      else if (!isDown && wasDown) handleButtonEnd("down");
    },
    [activeButtons, handleButtonStart, handleButtonEnd]
  );

  // Touch event handlers with multi-touch support
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();

      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);

        if (!element) continue;

        // Check if touch is on joystick
        if (joystickBaseRef.current?.contains(element) && !joystick.isActive) {
          updateJoystick(touch.clientX, touch.clientY, true);
          activeTouchesRef.current.set(touch.identifier, "joystick");
          return;
        }

        // Check if touch is on a button
        const button = element.closest("[data-action]");
        if (button) {
          const action = button.getAttribute("data-action");
          if (action && !activeTouchesRef.current.has(touch.identifier)) {
            handleButtonStart(action, touch.identifier);
            return;
          }
        }
      }
    },
    [joystick.isActive, updateJoystick, handleButtonStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();

      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const action = activeTouchesRef.current.get(touch.identifier);

        if (action === "joystick") {
          updateJoystick(touch.clientX, touch.clientY);
        }
      }
    },
    [updateJoystick]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();

      // Handle ended touches
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const action = activeTouchesRef.current.get(touch.identifier);

        if (action === "joystick") {
          // Reset joystick
          setJoystick({
            isActive: false,
            position: { x: 0, y: 0 },
            direction: { x: 0, y: 0 },
          });

          // Reset all directional controls
          ["up", "down", "left", "right"].forEach((dir) => {
            if (activeButtons.has(dir)) {
              handleButtonEnd(dir);
            }
          });
        } else if (action) {
          handleButtonEnd(action, touch.identifier);
        }

        activeTouchesRef.current.delete(touch.identifier);
      }
    },
    [activeButtons, handleButtonEnd]
  );

  // Joystick return animation
  useEffect(() => {
    if (
      !joystick.isActive &&
      (joystick.position.x !== 0 || joystick.position.y !== 0)
    ) {
      const interval = setInterval(() => {
        setJoystick((prev) => {
          const newX = prev.position.x * (1 - JOYSTICK_RETURN_SPEED);
          const newY = prev.position.y * (1 - JOYSTICK_RETURN_SPEED);

          if (Math.abs(newX) < 1 && Math.abs(newY) < 1) {
            return { ...prev, position: { x: 0, y: 0 } };
          }

          return { ...prev, position: { x: newX, y: newY } };
        });
      }, 16); // ~60fps

      return () => clearInterval(interval);
    }
  }, [joystick.isActive, joystick.position]);

  // Dynamic button sizing based on screen size - größer für mobile
  const getButtonSize = useCallback(() => {
    if (typeof window === "undefined") return { min: 70, max: 90 };

    const isSmallScreen = window.innerWidth < 400;
    const isLargeScreen = window.innerWidth > 800;

    if (isSmallScreen) return { min: 65, max: 85 };
    if (isLargeScreen) return { min: 80, max: 100 };
    return { min: 70, max: 90 };
  }, []);

  const buttonSize = getButtonSize();

  const buttonStyle = (action: string) => ({
    padding: "0",
    border: `3px solid #FFD700`,
    borderRadius: "50%",
    background: activeButtons.has(action)
      ? "linear-gradient(145deg, #FFD700, #FFA500)"
      : "linear-gradient(145deg, rgba(255, 215, 0, 0.15), rgba(255, 140, 0, 0.2))",
    backdropFilter: "blur(8px)",
    color: activeButtons.has(action) ? "#000" : "#FFD700",
    fontWeight: "bold" as const,
    fontSize: "clamp(14px, 4vw, 18px)",
    textAlign: "center" as const,
    userSelect: "none" as const,
    touchAction: "manipulation",
    boxShadow: activeButtons.has(action)
      ? "0 0 20px rgba(255, 215, 0, 0.8), inset 0 2px 4px rgba(0,0,0,0.2)"
      : "0 3px 12px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.2)",
    transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
    minWidth: `${buttonSize.min}px`,
    minHeight: `${buttonSize.min}px`,
    maxWidth: `${buttonSize.max}px`,
    maxHeight: `${buttonSize.max}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    WebkitTapHighlightColor: "transparent",
    cursor: "pointer",
    transform: activeButtons.has(action) ? "scale(0.9)" : "scale(1)",
  });

  const joystickStyle = {
    width: "clamp(120px, 28vw, 160px)",
    height: "clamp(120px, 28vw, 160px)",
    maxWidth: "180px",
    maxHeight: "180px",
    borderRadius: "50%",
    background:
      "linear-gradient(145deg, rgba(255, 215, 0, 0.1), rgba(255, 140, 0, 0.15))",
    border: "3px solid #FFD700",
    backdropFilter: "blur(8px)",
    boxShadow:
      "0 3px 15px rgba(0, 0, 0, 0.6), inset 0 1px 3px rgba(255, 255, 255, 0.2)",
    position: "relative" as const,
    touchAction: "none" as const,
    WebkitTapHighlightColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const joystickKnobStyle = {
    width: "clamp(50px, 12vw, 65px)",
    height: "clamp(50px, 12vw, 65px)",
    maxWidth: "75px",
    maxHeight: "75px",
    borderRadius: "50%",
    background: joystick.isActive
      ? "linear-gradient(145deg, #FFD700, #FFA500)"
      : "linear-gradient(145deg, rgba(255, 215, 0, 0.3), rgba(255, 140, 0, 0.4))",
    border: "2px solid #FFD700",
    position: "absolute" as const,
    left: "50%",
    top: "50%",
    transform: `translate(-50%, -50%) translate(${joystick.position.x}px, ${joystick.position.y}px)`,
    transition: joystick.isActive
      ? "none"
      : "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: joystick.isActive
      ? "0 0 15px rgba(255, 215, 0, 0.6), inset 0 1px 2px rgba(0,0,0,0.2)"
      : "0 2px 8px rgba(0, 0, 0, 0.4)",
    touchAction: "none" as const,
    pointerEvents: "none" as const,
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center px-2 sm:px-4"
      style={{
        paddingBottom: "max(12px, env(safe-area-inset-bottom))",
        paddingLeft: "max(8px, env(safe-area-inset-left))",
        paddingRight: "max(8px, env(safe-area-inset-right))",
        touchAction: "none",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Bottom section - Enhanced controls */}
      <div
        className="flex justify-between items-end w-full max-w-2xl"
        style={{ gap: "clamp(15px, 4vw, 25px)" }}
      >
        {/* Left side - Analog Joystick */}
        <div className="flex flex-col items-center gap-2">
          <div ref={joystickBaseRef} style={joystickStyle}>
            <div ref={joystickRef} style={joystickKnobStyle} />
          </div>
          <div className="text-white text-xs text-center opacity-75 select-none">
            Bewegen
          </div>
        </div>

        {/* Right side - Action Buttons */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-end gap-2">
            <button
              data-action="kick"
              style={buttonStyle("kick")}
              aria-label="Kick"
            >
              <div className="text-center leading-tight">
                <div className="text-base sm:text-lg font-black">A</div>
                <div className="text-xs mt-0.5">Tritt</div>
              </div>
            </button>
            <button
              data-action="defence"
              style={buttonStyle("defence")}
              aria-label="Defence"
            >
              <div className="text-center leading-tight">
                <div className="text-base sm:text-lg font-black">S</div>
                <div className="text-xs mt-0.5">Block</div>
              </div>
            </button>
          </div>
          <div className="flex justify-end gap-2">
            <button
              data-action="punch"
              style={buttonStyle("punch")}
              aria-label="Punch"
            >
              <div className="text-center leading-tight">
                <div className="text-base sm:text-lg font-black">D</div>
                <div className="text-xs mt-0.5">Schlag</div>
              </div>
            </button>
          </div>
          <div className="text-white text-xs text-center opacity-75 select-none">
            Aktionen
          </div>
        </div>
      </div>
    </div>
  );
}
