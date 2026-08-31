/**
 * User story 5 - the board.
 *
 * The screen renders the engine and nothing more: a click is passed on, and
 * whatever the engine reports back decides what the board does next. No rule
 * is repeated here, so the two can never disagree about whose turn it is.
 */
import { MISS_DELAY } from "../config.js";
import { getBoardSize } from "../data/board-sizes.js";
import { PLAYERS, getPlayer } from "../data/players.js";
import { motifSrc } from "../data/themes.js";
import { qs } from "../dom.js";
import { navigate } from "../router.js";
import { endGame, requireEngine } from "../store.js";
/**
 * How long the last matched pair stays on screen before the result.
 *
 * Without it the board would vanish in the same moment the player completes
 * it, and the last pair would never be seen.
 */
const FINISH_DELAY = 800;
/**
 * Wires the board up. Called once at start-up.
 *
 * The click handler sits on the board rather than on every card, so the cards
 * can be dealt and re-dealt without ever re-registering anything.
 */
export function initGame() {
    qs(".board").addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element))
            return;
        const card = target.closest(".card");
        if (card === null)
            return;
        const index = Number(card.dataset["index"]);
        if (Number.isNaN(index))
            return;
        handleFlip(index);
    });
    qs(".btn--exit").addEventListener("click", () => {
        endGame();
        navigate("home");
    });
}
/** Deals a fresh board. Runs on every visit to the screen. */
export function renderGame() {
    const engine = requireEngine();
    const size = getBoardSize(engine.config.size);
    const board = qs(".board");
    // the SCSS reads both off the board: the theme picks the colours, the
    // grid numbers lay the cards out
    board.dataset["theme"] = engine.config.theme;
    board.dataset["size"] = size.id;
    board.style.setProperty("--columns", String(size.columns));
    board.style.setProperty("--rows", String(size.rows));
    board.replaceChildren(...engine.cards.map((card, index) => buildCard(card, index, engine.config.theme)));
    syncCards();
    syncTopbar();
}
/**
 * Stamps one card out of the template in the markup.
 *
 * @param card - The card to show once it is turned over.
 * @param index - Its place on the board, which is how a click finds it again.
 * @param theme - The theme the motif file belongs to.
 * @returns The finished card, face down.
 */
function buildCard(card, index, theme) {
    const template = qs(".card-template");
    const copy = template.content.cloneNode(true);
    const button = qs(".card", copy);
    button.dataset["index"] = String(index);
    const motif = qs(".card__motif", copy);
    motif.src = motifSrc(theme, card.motif.id);
    // the button's own label already names the motif, so the image stays silent
    motif.alt = "";
    return button;
}
/**
 * Turns one card over and plays out what that led to.
 *
 * @param index - The card that was clicked.
 */
function handleFlip(index) {
    const engine = requireEngine();
    const outcome = engine.flip(index);
    switch (outcome.kind) {
        case "ignored":
            return;
        case "first":
            syncCards();
            return;
        case "match":
            syncCards();
            syncTopbar();
            if (outcome.finished)
                window.setTimeout(() => navigate("gameover"), FINISH_DELAY);
            return;
        case "miss":
            // both stay up long enough to be memorized, then the engine turns them
            // back over and the turn passes
            syncCards();
            window.setTimeout(() => {
                engine.settle();
                syncCards();
                syncTopbar();
            }, MISS_DELAY);
            return;
        default: {
            // if a new outcome is ever added, this line stops compiling
            const never = outcome;
            return never;
        }
    }
}
/**
 * Writes the deck's state onto the cards.
 *
 * Only classes are set, never the markup - replacing a card mid-turn would
 * restart the flip animation from the beginning.
 */
function syncCards() {
    const engine = requireEngine();
    const board = qs(".board");
    engine.cards.forEach((card, index) => {
        const button = board.children[index];
        if (!(button instanceof HTMLButtonElement))
            return;
        const open = card.state !== "hidden";
        button.classList.toggle("is-flipped", open);
        button.classList.toggle("is-matched", card.state === "matched");
        // a found pair stays on the board but is out of play
        button.disabled = card.state === "matched";
        button.setAttribute("aria-label", open ? `Card ${index + 1}, ${card.motif.label}` : `Card ${index + 1}, face down`);
    });
}
/** Puts the scores and the active player in the topbar. */
function syncTopbar() {
    const engine = requireEngine();
    const scores = engine.scores;
    // the result screen carries a second pair of these chips, so the lookup
    // stays inside the topbar
    const topbar = qs(".topbar");
    for (const player of PLAYERS) {
        const scorecard = qs(`.scorecard[data-player="${player.id}"]`, topbar);
        qs(".scorecard__value", scorecard).textContent = String(scores[player.id]);
        scorecard.classList.toggle("is-active", engine.currentPlayer === player.id);
    }
    const turn = qs(".topbar__player", topbar);
    turn.textContent = getPlayer(engine.currentPlayer).label;
    turn.dataset["player"] = engine.currentPlayer;
}
//# sourceMappingURL=game.js.map