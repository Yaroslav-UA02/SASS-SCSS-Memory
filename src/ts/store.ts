/**
 * The app state that outlives a single screen.
 *
 * At the moment that is the settings draft: the settings screen writes into
 * it, and the screens after it read from it. Keeping it here instead of in
 * the screen module means a later screen does not have to reach back into the
 * settings markup to find out what was chosen.
 */

import type { BoardSizeId, GameConfig, PlayerId, SettingsDraft, ThemeId } from "./types.js";

/** Empty draft: the settings screen starts with nothing preselected. */
const draft: SettingsDraft = { theme: null, player: null, size: null };

/** Stores the chosen theme. */
export function setTheme(value: ThemeId): void {
  draft.theme = value;
}

/** Stores the player who takes the first turn. */
export function setPlayer(value: PlayerId): void {
  draft.player = value;
}

/** Stores the chosen board size. */
export function setSize(value: BoardSizeId): void {
  draft.size = value;
}

/**
 * The current selection.
 *
 * Handed out read-only, so a screen can render from it but has to go through
 * the setters above to change it.
 */
export function getDraft(): Readonly<SettingsDraft> {
  return draft;
}

/** Whether all three settings are picked - only then may the round start. */
export function isDraftComplete(): boolean {
  return draft.theme !== null && draft.player !== null && draft.size !== null;
}

/**
 * Turns the draft into the settings a round runs on.
 *
 * @returns The completed configuration.
 * @throws If something is still missing - callers check
 * {@link isDraftComplete} first.
 */
export function toGameConfig(): GameConfig {
  const { theme, player, size } = draft;
  if (theme === null || player === null || size === null) {
    throw new Error("Settings are not complete yet");
  }
  return { theme, startingPlayer: player, size };
}
