// zentrale typen des spiels.
// die datei waechst mit: was eine user story braucht, kommt dazu.

// die vier themes aus den settings. als union statt string,
// damit ein tippfehler schon beim kompilieren auffaellt.
export type ThemeId = "code-vibes" | "gaming" | "da-projects" | "foods";

export type PlayerId = "blue" | "orange";

export type BoardSizeId = "4x4" | "4x6" | "6x6";

// jeder screen der app - der router zeigt immer genau einen davon
export type ScreenId = "home" | "settings" | "game" | "gameover";

// ein theme bringt sein farbschema und seine karten-motive mit
export interface Theme {
  readonly id: ThemeId;
  readonly label: string;
  readonly backGlyph: string; // symbol auf der kartenrueckseite
  readonly motifs: readonly string[];
}

export interface Player {
  readonly id: PlayerId;
  readonly label: string;
}

export interface BoardSize {
  readonly id: BoardSizeId;
  readonly label: string;
  readonly columns: number;
  readonly rows: number;
}

// eine karte ist verdeckt, kurz aufgedeckt oder als paar gefunden
export type CardState = "hidden" | "revealed" | "matched";

export interface Card {
  readonly id: number;
  readonly pairId: number; // zwei karten mit gleicher pairId gehoeren zusammen
  readonly motif: string;
  state: CardState;
}
