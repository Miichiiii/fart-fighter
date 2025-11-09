"use client";

import { useIsMobile } from "@/hooks/use-mobile";

export function FightControls() {
  const isMobile = useIsMobile();

  // On mobile, don't show keyboard controls (mobile touch controls are displayed instead)
  if (isMobile) {
    return null;
  }

  const controlStyle = {
    padding: "8px 16px",
    border: "2px solid #444",
    borderRadius: "8px",
    backgroundColor: "#1a1a1a",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
    minWidth: "140px",
    textAlign: "center" as const,
  };

  const keyStyle = {
    color: "#FFD700",
    fontWeight: "bold" as const,
    fontSize: "16px",
    backgroundColor: "#2a2a2a",
    padding: "2px 8px",
    borderRadius: "4px",
    border: "1px solid #FFD700",
    display: "inline-block",
    marginRight: "8px",
  };

  const separatorStyle = {
    width: "2px",
    height: "30px",
    backgroundColor: "#444",
    margin: "0 8px",
  };

  return (
    <div
      className="w-full py-4 px-4 flex justify-center items-center gap-4 text-sm game-text text-white"
      style={{
        backgroundColor: "#000000",
        color: "#ffffff",
      }}
    >
      <div style={controlStyle}>
        <span style={keyStyle}>← →</span>
        Bewegen
      </div>

      <div style={separatorStyle}></div>

      <div style={controlStyle}>
        <span style={keyStyle}>↑</span>
        Springen
      </div>
      <div style={controlStyle}>
        <span style={keyStyle}>↓</span>
        Ducken
      </div>

      <div style={separatorStyle}></div>

      <div style={controlStyle}>
        <span style={keyStyle}>A</span>
        Treten
      </div>
      <div style={controlStyle}>
        <span style={keyStyle}>S</span>
        Verteidigung
      </div>
      <div style={controlStyle}>
        <span style={keyStyle}>D</span>
        Schlagen
      </div>

      <div style={separatorStyle}></div>

      <div style={controlStyle}>
        <span style={keyStyle}>↑+A</span>
        Sprung-Tritt
      </div>
    </div>
  );
}
