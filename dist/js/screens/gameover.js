/**
 * User story 6 - the result screen.
 *
 * The round is already over by the time this screen is entered, so nothing is
 * worked out here: the engine hands out the final standings and the screen
 * only puts them into words. The engine is kept alive until the player leaves,
 * because the standings are read on every entry.
 */
import { renderScorecards } from "../components/scoreboard.js";
import { getPlayer } from "../data/players.js";
import { qs } from "../dom.js";
import { navigate } from "../router.js";
import { endGame, requireEngine, startGame } from "../store.js";
/** Wires the two ways on from the result up. Called once at start-up. */
export function initGameover() {
    // same settings, fresh deck - the engine deals a new one on every start
    qs(".btn--again").addEventListener("click", () => {
        startGame();
        navigate("game");
    });
    qs(".btn--home").addEventListener("click", () => {
        endGame();
        navigate("home");
    });
}
/** Writes the final standings out. Runs on every visit to the screen. */
export function renderGameover() {
    const { scores, winner } = requireEngine().result;
    const gameover = qs(".gameover");
    renderHeadline(qs(".gameover__title", gameover), winner);
    // the chips are the topbar's, so the final score is read exactly the way it
    // was read all round - only the highlight moves from the turn to the winner
    renderScorecards(gameover, scores, winner);
}
/**
 * Announces the winner, or the draw.
 *
 * The name is written in the winner's own colour, the way the turn is written
 * in the topbar. A draw belongs to neither player, so the attribute comes off
 * again rather than keeping the colour of whoever won last time.
 *
 * @param headline - Element the result is written into.
 * @param winner - Who won, `null` on a draw.
 */
function renderHeadline(headline, winner) {
    if (winner === null) {
        headline.textContent = "It's a draw!";
        delete headline.dataset["player"];
        return;
    }
    headline.textContent = `${getPlayer(winner).label} wins!`;
    headline.dataset["player"] = winner;
}
//# sourceMappingURL=gameover.js.map