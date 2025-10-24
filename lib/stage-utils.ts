// Liste der verfügbaren Kampf-Arenen Hintergründe
const kampfArenaHintergruende = [
  "/images/stages/gif-class.gif",
  "/images/stages/stage2.gif",
  "/images/stages/gif.gif",
];

// Funktion um die Kampf-Arena basierend auf der Rundenzahl auszuwählen
export function getStageBackgroundByRound(round: number): string {
  // Verwende die Rundenzahl um die Stage auszuwählen
  // Round 1 = stage-1, Round 2 = stage-2, etc.
  const index = (round - 1) % kampfArenaHintergruende.length;
  return kampfArenaHintergruende[index];
}

// Legacy-Funktion für zufällige Auswahl (falls noch irgendwo verwendet)
export function getRandomStageBackground(): string {
  const zufaelligerIndex = Math.floor(
    Math.random() * kampfArenaHintergruende.length
  );
  return kampfArenaHintergruende[zufaelligerIndex];
}
