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

/**
 * One picture on a card face, together with the wording a screen reader
 * announces for it.
 */
export interface Motif {
  /** Doubles as the file name: `assets/icons/<theme>/<id>.svg`. */
  readonly id: string;
  /** Used as the image's alt text, so it names the picture, not the file. */
  readonly label: string;
}

/**
 * A theme is the motif set behind one entry in the settings.
 *
 * The color scheme belongs to the SCSS, which reads it off the board's
 * `data-theme` attribute - that keeps every hex value in one place.
 */
export interface Theme {
  readonly id: ThemeId;
  readonly label: string;
  readonly motifs: readonly Motif[];
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
  /** Both cards of a pair carry the same motif. */
  readonly motif: Motif;
  state: CardState;
}
