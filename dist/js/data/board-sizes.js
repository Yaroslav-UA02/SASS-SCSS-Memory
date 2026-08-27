/**
 * The three board sizes offered in the settings.
 *
 * The id names the grid, the label names what the player sees: `4x6` is
 * 24 cards, so 12 pairs. Every size stays even, otherwise a card would be
 * left without its partner.
 */
/** Every size, in the order the settings screen lists them. */
export const BOARD_SIZES = [
    { id: "4x4", label: "16 cards", columns: 4, rows: 4 },
    { id: "4x6", label: "24 cards", columns: 6, rows: 4 },
    { id: "6x6", label: "36 cards", columns: 6, rows: 6 },
];
/**
 * Looks a board size up by id.
 *
 * @param id - The size picked in the settings.
 * @returns The matching size.
 * @throws If no size carries that id, which means the markup and this
 * module have drifted apart.
 */
export function getBoardSize(id) {
    const size = BOARD_SIZES.find((candidate) => candidate.id === id);
    if (!size) {
        throw new Error(`Unknown board size: ${id}`);
    }
    return size;
}
/**
 * How many pairs a size needs.
 *
 * @param size - The chosen board size.
 * @returns Half the number of cards - the motifs the deck draws.
 */
export function pairCount(size) {
    return (size.columns * size.rows) / 2;
}
//# sourceMappingURL=board-sizes.js.map