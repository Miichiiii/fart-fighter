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
    padding: "10px",
    border: "2px solid #FFD700",
    borderRadius: "12px",
    backgroundColor: activeButtons.has(action)
      ? "#FFD700"
      : "rgba(26, 26, 26, 0.85)",
    color: activeButtons.has(action) ? "#000" : "#FFD700",
    fontWeight: "bold" as const,
    fontSize: "12px",
    textAlign: "center" as const,
    userSelect: "none" as const,
    touchAction: "manipulation",
    boxShadow: activeButtons.has(action)
      ? "0 0 15px rgba(255, 215, 0, 0.9), inset 0 2px 4px rgba(0,0,0,0.3)"
      : "0 3px 10px rgba(0, 0, 0, 0.8)",
    transition: "all 0.05s ease",
    minWidth: "60px",
    minHeight: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    WebkitTapHighlightColor: "transparent",
    cursor: "pointer",
    transform: activeButtons.has(action) ? "scale(0.95)" : "scale(1)",
  });

  const dpadButtonStyle = (action: string) => ({
    ...buttonStyle(action),
    minWidth: "70px",
    minHeight: "70px",
    fontSize: "24px",
    borderWidth: "3px",
  });

  return (
    <div
      className="fixed bottom-0 left-0 right-0 pointer-events-none z-50"
      style={{
        padding: "8px",
        paddingBottom: "max(20px, env(safe-area-inset-bottom))",
        background:
          "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)",
      }}
    >
      {/* Bottom section - controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "10px",
          pointerEvents: "auto",
        }}
      >
        {/* Left side - D-Pad */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
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
            >
              ↑
            </button>
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "8px" }}
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
            >
              →
            </button>
          </div>
        </div>

        {/* Right side - Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}
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
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "14px", marginBottom: "4px" }}>A</div>
                <div style={{ fontSize: "10px" }}>Tritt</div>
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
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "14px", marginBottom: "4px" }}>S</div>
                <div style={{ fontSize: "10px" }}>Block</div>
              </div>
            </button>
          </div>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}
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
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "14px", marginBottom: "4px" }}>D</div>
                <div style={{ fontSize: "10px" }}>Schlag</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
