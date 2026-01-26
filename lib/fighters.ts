export interface FighterStats {
  speed: number; // 1-10: Bewegungsgeschwindigkeit
  power: number; // 1-10: Angriffsstärke
  defense: number; // 1-10: Verteidigungsstärke
  stamina: number; // 1-10: Ausdauer
}

export interface Fighter {
  id: string;
  name: string;
  description: string;
  portrait: string;
  sprite: string;
  punchSprite?: string;
  kickSprite?: string;
  duckSprite?: string;
  jumpSprite?: string;
  jumpKickSprite?: string;
  defenceSprite?: string;
  walkSprite?: string;
  lostSprite?: string;
  wonSprite?: string;
  hitSprite?: string;
  useSingleSprite?: boolean;
  specialMove: string;
  stats: FighterStats;
}

export const fighters: Fighter[] = [
  {
    id: "der-furzkoenig",
    name: "Der Furzkönig",
    description: "Meister der stinkenden Kampfkunst mit legendärem Donner",
    portrait: "/images/fighters/2-derf.png",
    sprite: "/images/fighters/1-kingg-steht-removebg-preview.png",
    punchSprite: "/images/fighters/1-king-angrif-removebg-preview.png",
    kickSprite: "/images/fighters/1-king-kick-removebg-preview.png",
    duckSprite: "/images/fighters/1-king-def-removebg-preview1.png",
    jumpSprite: "/images/fighters/1-king-jump-removebg-preview.png",
    defenceSprite: "/images/fighters/1-king-verteidigung-removebg-preview.png",
    walkSprite: "/images/fighters/1-king-geht-removebg-preview.png",
    lostSprite: "/images/fighters/1-king-verlust-removebg-preview.png",
    wonSprite: "/images/fighters/1-king-vic-removebg-preview.png",
    hitSprite: "/images/fighters/1-king-def-removebg-preview.png",
    useSingleSprite: true,
    specialMove: "Donnernder Duft-Hammer",
    stats: { speed: 6, power: 8, defense: 7, stamina: 5 },
  },
  {
    id: "mrs-stinky",
    name: "Mrs. Stinky",
    description: "Präzise Gaswolken mit tödlicher Treffsicherheit",
    portrait: "/images/fighters/6-mrs.png",
    sprite: "/images/fighters/2-mrsverteidigun-removebg-preview.png",
    punchSprite: "/images/fighters/2-mrs-angriff-removebg-preview.png",
    kickSprite: "/images/fighters/2-mrs-kick-removebg-preview.png",
    duckSprite: "/images/fighters/2-mrs-ducken-removebg-preview.png",
    jumpSprite: "/images/fighters/2-mrs-spr-removebg-preview.png",
    jumpKickSprite: "/images/fighters/2-mrs-jumpkick-removebg-preview.png",
    defenceSprite: "/images/fighters/2-mrs-def-removebg-preview.png",
    walkSprite: "/images/fighters/2-mrs-gehen-removebg-preview.png",
    lostSprite: "/images/fighters/2-mrs-verl-removebg-preview.png",
    wonSprite: "/images/fighters/2-mrs-sieg-removebg-preview.png",
    hitSprite: "/images/fighters/2-mrs-hit-removebg-preview.png",
    useSingleSprite: true,
    specialMove: "Sonic Stink-Welle",
    stats: { speed: 8, power: 6, defense: 5, stamina: 7 },
  },
  {
    id: "don-farty",
    name: "Don Farty",
    description: "Blitzschnelle Flatulenzen im Sekundentakt",
    portrait: "/images/fighters/4-don.png",
    sprite: "/images/fighters/4-op-steh-removebg-preview.png",
    punchSprite: "/images/fighters/4-op-ang-removebg-preview.png",
    kickSprite: "/images/fighters/4-op-kick-removebg-preview.png",
    duckSprite: "/images/fighters/4-op-dck-removebg-preview.png",
    jumpSprite: "/images/fighters/4-op-jump-removebg-preview.png",
    defenceSprite: "/images/fighters/4-op-vert-removebg-preview.png",
    walkSprite: "/images/fighters/4-op-walk-removebg-preview.png",
    lostSprite: "/images/fighters/4-op-lost-removebg-preview.png",
    wonSprite: "/images/fighters/4-op-win-removebg-preview.png",
    hitSprite: "/images/fighters/4-op-angegriffn-removebg-preview.png",
    useSingleSprite: true,
    specialMove: "Turbo-Pups Combo",
    stats: { speed: 9, power: 5, defense: 4, stamina: 8 },
  },
  {
    id: "detektiv-duftnote",
    name: "Detektiv Duftnote",
    description: "Mysteriöse Gasmischungen aus geheimer Rezeptur",
    portrait: "/images/fighters/3-derdete.png",
    sprite: "/images/fighters/3-derd-vert-removebg-preview.png",
    punchSprite: "/images/fighters/2-mrsverteidigun-removebg-preview.png",
    kickSprite: "/images/fighters/4-derd-kick-removebg-preview.png",
    duckSprite: "/images/fighters/3-derd-duck-removebg-preview.png",
    jumpSprite: "/images/fighters/3-derd-jump-removebg-preview.png",
    defenceSprite: "/images/fighters/3-derd-def-removebg-preview.png",
    walkSprite: "/images/fighters/3-derd-geh-removebg-preview.png",
    lostSprite: "/images/fighters/3-derd-verl1-removebg-preview.png",
    wonSprite: "/images/fighters/3-derd-sieg-removebg-preview.png",
    hitSprite: "/images/fighters/3-derd-attac-removebg-preview.png",
    useSingleSprite: true,
    specialMove: "Drei-Gänge-Geruchs-Menü",
    stats: { speed: 7, power: 7, defense: 6, stamina: 6 },
  },
  {
    id: "mr-furz",
    name: "Mr Furz",
    description: "Ausgewogene Mischung aus Lautstärke und Intensität",
    portrait: "/images/fighters/1.png",
    sprite: "/images/fighters/5-mr-vert-removebg-preview.png",
    punchSprite: "/images/fighters/5-mr-ang-removebg-preview.png",
    kickSprite: "/images/fighters/5-mr-kick-removebg-preview.png",
    duckSprite: "/images/fighters/5-mr-duck-removebg-preview.png",
    jumpSprite: "/images/fighters/5-mr-jump-removebg-preview.png",
    defenceSprite: "/images/fighters/5-mr-vert1-removebg-preview.png",
    walkSprite: "/images/fighters/5-mr-geh-removebg-preview.png",
    lostSprite: "/images/fighters/5-mr-lost-removebg-preview.png",
    wonSprite: "/images/fighters/5-mr-sieg-removebg-preview.png",
    hitSprite: "/images/fighters/5-mrangegr-removebg-preview.png",
    useSingleSprite: true,
    specialMove: "Pümpel-Pracht-Schlag",
    stats: { speed: 6, power: 6, defense: 6, stamina: 6 },
  },
  {
    id: "dr-dampf",
    name: "Dr Dampf",
    description: "Unzerbrechlicher Gestank mit eiserner Darmkraft",
    portrait: "/images/fighters/5-derdr.png",
    sprite: "/images/fighters/6-dok-stand-removebg-preview.png",
    punchSprite: "/images/fighters/6-dok-angr-removebg-preview.png",
    kickSprite: "/images/fighters/6-dok-kick-removebg-preview.png",
    duckSprite: "/images/fighters/6-dok-duck-removebg-preview.png",
    jumpSprite: "/images/fighters/6-dok-jump-removebg-preview.png",
    defenceSprite: "/images/fighters/6-dok-def-removebg-preview.png",
    walkSprite: "/images/fighters/6-dok-geh-removebg-preview.png",
    lostSprite: "/images/fighters/6-dok-lost-removebg-preview.png",
    wonSprite: "/images/fighters/6-dok-lost-removebg-preview.png",
    hitSprite: "/images/fighters/6-dok-angegr-removebg-preview.png",
    useSingleSprite: true,
    specialMove: "Eiserne-Därme-Defense",
    stats: { speed: 4, power: 7, defense: 9, stamina: 6 },
  },
];
