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
      } w-full sm:w-1/3 max-w-[200px] sm:max-w-none`}
    >
      <div className="game-text mb-1 text-xs sm:text-sm truncate max-w-full">
        {name}
      </div>
      <div className="power-bar w-full">
        <div
          className="power-bar-fill"
          style={{
            width: `${health}%`,
            float: reversed ? "right" : "left",
          }}
        />
      </div>
    </div>
  );
}
