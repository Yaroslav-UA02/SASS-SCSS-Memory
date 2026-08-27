/**
 * The two players a round is played with.
 *
 * Only the wording lives here. Blue and orange are colors from the design, so
 * the SCSS owns the hex values and reads the player off a `data-player`
 * attribute - same split as with the themes.
 */
/** Both players, in the order the settings screen lists them. */
export const PLAYERS = [
    { id: "blue", label: "Blue" },
    { id: "orange", label: "Orange" },
];
/**
 * Looks a player up by id.
 *
 * @param id - The player picked in the settings.
 * @returns The matching player.
 * @throws If no player carries that id, which means the markup and this
 * module have drifted apart.
 */
export function getPlayer(id) {
    const player = PLAYERS.find((candidate) => candidate.id === id);
    if (!player) {
        throw new Error(`Unknown player: ${id}`);
    }
    return player;
}
//# sourceMappingURL=players.js.map