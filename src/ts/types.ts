/**
 * Central types of the game.
 * The file grows along the way: whatever a user story needs gets added.
 */

/**
 * The three themes from the settings. A union instead of `string`,
 * so a typo is caught at compile time already.
 */
export type ThemeId = "code-vibes" | "gaming" | "foods";

/** The two players a round is played with. */
export type PlayerId = "blue" | "orange";

/** The three board sizes offered in the settings. */
export type BoardSizeId = "4x4" | "4x6" | "6x6";

/** Every screen of the app - the router always shows exactly one of them. */
export type ScreenId = "home" | "settings" | "game" | "gameover";

/** A theme brings its own color scheme and card motifs. */
export interface Theme {
  readonly id: ThemeId;
  readonly label: string;
  /** Symbol shown on the card back. */
  readonly backGlyph: string;
  readonly motifs: readonly string[];
}

/** A player as shown in the score bar above the board. */
export interface Player {
  readonly id: PlayerId;
  readonly label: string;
}

/** A board size with the grid it expands to. */
export interface BoardSize {
  readonly id: BoardSizeId;
  readonly label: string;
  readonly columns: number;
  readonly rows: number;
}

/** A card is hidden, briefly revealed or matched as a pair. */
export type CardState = "hidden" | "revealed" | "matched";

/** A single card on the board. */
export interface Card {
  readonly id: number;
  /** Two cards with the same `pairId` belong together. */
  readonly pairId: number;
  readonly motif: string;
  state: CardState;
}
