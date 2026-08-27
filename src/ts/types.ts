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

/**
 * What the settings screen has collected so far.
 *
 * Nothing is preselected, so each entry stays `null` until the player picks
 * it - that is exactly what keeps the start button locked.
 */
export interface SettingsDraft {
  theme: ThemeId | null;
  player: PlayerId | null;
  size: BoardSizeId | null;
}

/** A complete draft, i.e. the settings a round is actually started with. */
export interface GameConfig {
  readonly theme: ThemeId;
  /** The player taking the first turn. */
  readonly startingPlayer: PlayerId;
  readonly size: BoardSizeId;
}

/** How many pairs each player has collected. */
export type Scores = Record<PlayerId, number>;

/**
 * What turning a card over led to.
 *
 * A discriminated union rather than a bag of optional fields: the board
 * switches on `kind` and TypeScript then knows exactly which data comes with
 * it, so there is no case the animation code can silently forget.
 */
export type FlipOutcome =
  /** The click did not count - card already open, or the board is locked. */
  | { readonly kind: "ignored" }
  /** First card of the turn is now face up. */
  | { readonly kind: "first"; readonly index: number }
  /** Both cards match; they stay open and the same player goes again. */
  | {
      readonly kind: "match";
      readonly indices: readonly [number, number];
      readonly player: PlayerId;
      readonly finished: boolean;
    }
  /** No match; the cards stay up until the board calls `settle`. */
  | { readonly kind: "miss"; readonly indices: readonly [number, number] };

/** The final standings of a round. */
export interface GameResult {
  readonly scores: Scores;
  /** `null` on a draw. */
  readonly winner: PlayerId | null;
}
