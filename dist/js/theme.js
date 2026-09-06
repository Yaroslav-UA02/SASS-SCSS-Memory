/**
 * The colour scheme of the round in progress.
 *
 * A theme is not a property of the board but of the whole page: the surface
 * under the cards, the ink written on it and the outlined way out all sit
 * above the grid in the markup. So the choice is written onto the document
 * once and every screen below reads it out of the cascade - see
 * `styles/base/_themes.scss`, which turns it into custom properties.
 */
/**
 * Puts the round's colours on the page.
 *
 * @param theme - The theme the round was started with.
 */
export function applyTheme(theme) {
    document.body.dataset["theme"] = theme;
}
/**
 * Takes them off again.
 *
 * The board is the only screen that is painted from the theme, so the scheme
 * comes off as soon as the round ends - on the way out of the board and on
 * the way into the result, which is dark whatever was just played.
 */
export function clearTheme() {
    delete document.body.dataset["theme"];
}
//# sourceMappingURL=theme.js.map