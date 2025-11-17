"use client";

import { useEffect, useState } from "react";

interface MobileControlsProps {
  onAction: (action: string, isPressed: boolean) => void;
}

export function MobileControls({ onAction }: MobileControlsProps) {
  const [activeButtons, setActiveButtons] = useState<Set<string>>(new Set());

  const handleTouchStart = (action: string) => {
    setActiveButtons((prev) => new Set(prev).add(action));
    onAction(action, true);
  };

  const handleTouchEnd = (action: string) => {
    setActiveButtons((prev) => {
      const next = new Set(prev);
      next.delete(action);
      return next;
    });
    onAction(action, false);
  };

  const buttonStyle = (action: string) => ({
    padding: "0",
    border: "4px solid #FFD700",
    borderRadius: "50%",
    background: activeButtons.has(action)
      ? "linear-gradient(145deg, #FFD700, #FFA500)"
      : "linear-gradient(145deg, rgba(255, 215, 0, 0.2), rgba(255, 140, 0, 0.3))",
    backdropFilter: "blur(10px)",
    color: activeButtons.has(action) ? "#000" : "#FFD700",
    fontWeight: "bold" as const,
    fontSize: "16px",
    textAlign: "center" as const,
    userSelect: "none" as const,
    touchAction: "manipulation",
    boxShadow: activeButtons.has(action)
      ? "0 0 25px rgba(255, 215, 0, 0.9), inset 0 2px 5px rgba(0,0,0,0.3)"
      : "0 4px 15px rgba(0, 0, 0, 0.6), inset 0 1px 3px rgba(255, 255, 255, 0.3)",
    transition: "all 0.12s cubic-bezier(0.4, 0, 0.2, 1)",
    minWidth: "75px",
    minHeight: "75px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    WebkitTapHighlightColor: "transparent",
    cursor: "pointer",
    transform: activeButtons.has(action) ? "scale(0.92)" : "scale(1)",
  });

  const dpadButtonStyle = (action: string) => ({
    padding: "0",
    border: "4px solid #FFD700",
    borderRadius: "15px",
    background: activeButtons.has(action)
      ? "linear-gradient(145deg, #FFD700, #FFA500)"
      : "linear-gradient(145deg, rgba(255, 215, 0, 0.2), rgba(255, 140, 0, 0.3))",
    backdropFilter: "blur(10px)",
    color: activeButtons.has(action) ? "#000" : "#FFD700",
    fontWeight: "bold" as const,
    fontSize: "32px",
    textAlign: "center" as const,
    userSelect: "none" as const,
    touchAction: "manipulation",
    boxShadow: activeButtons.has(action)
      ? "0 0 25px rgba(255, 215, 0, 0.9), inset 0 2px 5px rgba(0,0,0,0.3)"
      : "0 4px 15px rgba(0, 0, 0, 0.6), inset 0 1px 3px rgba(255, 255, 255, 0.3)",
    transition: "all 0.12s cubic-bezier(0.4, 0, 0.2, 1)",
    minWidth: "85px",
    minHeight: "85px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    WebkitTapHighlightColor: "transparent",
    cursor: "pointer",
    transform: activeButtons.has(action) ? "scale(0.92)" : "scale(1)",
  });

  return (
    <div
      className="fixed bottom-0 left-0 right-0 pointer-events-none z-50"
      style={{
        padding: "12px",
        paddingBottom: "max(24px, env(safe-area-inset-bottom))",
        background:
          "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
      }}
    >
      {/* Bottom section - controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "15px",
          pointerEvents: "auto",
        }}
      >
        {/* Left side - D-Pad */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                handleTouchStart("up");
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleTouchEnd("up");
              }}
              style={dpadButtonStyle("up")}
              aria-label="Jump"
            >
              ↑
            </button>
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                handleTouchStart("left");
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleTouchEnd("left");
              }}
              style={dpadButtonStyle("left")}
              aria-label="Move Left"
            >
              ←
            </button>
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                handleTouchStart("down");
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleTouchEnd("down");
              }}
              style={dpadButtonStyle("down")}
              aria-label="Duck"
            >
              ↓
            </button>
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                handleTouchStart("right");
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleTouchEnd("right");
              }}
              style={dpadButtonStyle("right")}
              aria-label="Move Right"
            >
              →
            </button>
          </div>
        </div>

        {/* Right side - Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "14px" }}
          >
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                handleTouchStart("kick");
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleTouchEnd("kick");
              }}
              style={buttonStyle("kick")}
              aria-label="Kick"
            >
              <div style={{ textAlign: "center", lineHeight: "1.2" }}>
                <div style={{ fontSize: "20px", fontWeight: "900" }}>A</div>
                <div style={{ fontSize: "11px", marginTop: "2px" }}>Tritt</div>
              </div>
            </button>
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                handleTouchStart("defence");
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleTouchEnd("defence");
              }}
              style={buttonStyle("defence")}
              aria-label="Defence"
            >
              <div style={{ textAlign: "center", lineHeight: "1.2" }}>
                <div style={{ fontSize: "20px", fontWeight: "900" }}>S</div>
                <div style={{ fontSize: "11px", marginTop: "2px" }}>Block</div>
              </div>
            </button>
          </div>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "14px" }}
          >
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                handleTouchStart("punch");
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleTouchEnd("punch");
              }}
              style={buttonStyle("punch")}
              aria-label="Punch"
            >
              <div style={{ textAlign: "center", lineHeight: "1.2" }}>
                <div style={{ fontSize: "20px", fontWeight: "900" }}>D</div>
                <div style={{ fontSize: "11px", marginTop: "2px" }}>Schlag</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
