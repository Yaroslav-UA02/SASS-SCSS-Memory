// central types of the game.
// the file grows along the way: whatever a user story needs gets added.

// the four themes from the settings. a union instead of string,
// so a typo is caught at compile time already.
export type ThemeId = "code-vibes" | "gaming" | "da-projects" | "foods";

export type PlayerId = "blue" | "orange";

export type BoardSizeId = "4x4" | "4x6" | "6x6";

// every screen of the app - the router always shows exactly one of them
export type ScreenId = "home" | "settings" | "game" | "gameover";

// a theme brings its own color scheme and card motifs
export interface Theme {
  readonly id: ThemeId;
  readonly label: string;
  readonly backGlyph: string; // symbol on the card back
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

// a card is hidden, briefly revealed or matched as a pair
export type CardState = "hidden" | "revealed" | "matched";

export interface Card {
  readonly id: number;
  readonly pairId: number; // two cards with the same pairId belong together
  readonly motif: string;
  state: CardState;
}
