interface PowerBarProps {
  health: number;
  name: string;
  reversed?: boolean;
}

export function PowerBar({ health, name, reversed = false }: PowerBarProps) {
  return (
    <div
      className={`flex flex-col ${
        reversed ? "items-end" : "items-start"
      } w-full sm:w-1/3 max-w-[180px] sm:max-w-none`}
    >
      <div
        className="game-text mb-2 text-sm sm:text-base font-bold truncate max-w-full tracking-wider"
        style={{
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.9)",
        }}
      >
        {name}
      </div>
      <div className="power-bar w-full relative">
        <div
          className="power-bar-fill"
          style={{
            width: `${health}%`,
            float: reversed ? "right" : "left",
            transition: "width 0.3s ease-out",
            background:
              health > 50
                ? "linear-gradient(to right, #10b981, #22c55e)"
                : health > 25
                ? "linear-gradient(to right, #f59e0b, #f97316)"
                : "linear-gradient(to right, #ef4444, #dc2626)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)",
          }}
        />
      </div>
    </div>
  );
}
