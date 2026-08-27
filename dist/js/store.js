/**
 * The app state that outlives a single screen.
 *
 * At the moment that is the settings draft: the settings screen writes into
 * it, and the screens after it read from it. Keeping it here instead of in
 * the screen module means a later screen does not have to reach back into the
 * settings markup to find out what was chosen.
 */
/** Empty draft: the settings screen starts with nothing preselected. */
const draft = { theme: null, player: null, size: null };
/** Stores the chosen theme. */
export function setTheme(value) {
    draft.theme = value;
}
/** Stores the player who takes the first turn. */
export function setPlayer(value) {
    draft.player = value;
}
/** Stores the chosen board size. */
export function setSize(value) {
    draft.size = value;
}
/**
 * The current selection.
 *
 * Handed out read-only, so a screen can render from it but has to go through
 * the setters above to change it.
 */
export function getDraft() {
    return draft;
}
/** Whether all three settings are picked - only then may the round start. */
export function isDraftComplete() {
    return draft.theme !== null && draft.player !== null && draft.size !== null;
}
/**
 * Turns the draft into the settings a round runs on.
 *
 * @returns The completed configuration.
 * @throws If something is still missing - callers check
 * {@link isDraftComplete} first.
 */
export function toGameConfig() {
    const { theme, player, size } = draft;
    if (theme === null || player === null || size === null) {
        throw new Error("Settings are not complete yet");
    }
    return { theme, startingPlayer: player, size };
}
//# sourceMappingURL=store.js.map