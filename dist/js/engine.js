/**
 * The rules of the game, with no idea that a DOM exists.
 *
 * The engine owns the deck, the scores and whose turn it is. It never touches
 * an element, so the board screen stays a pure renderer: it reports a click,
 * gets a {@link FlipOutcome} back and animates it.
 */
import { TURN_ORDER } from "./config.js";
import { getBoardSize, pairCount } from "./data/board-sizes.js";
import { getTheme } from "./data/themes.js";
/**
 * Shuffles an array in place.
 *
 * Walks the deck from the back and swaps every position with a randomly
 * picked earlier one, which gives every arrangement the same chance -
 * unlike `sort` with a random comparator, which favours some orders.
 *
 * @param items - The array to shuffle; it is modified.
 * @returns The same array, for chaining.
 */
function shuffle(items) {
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const a = items[i];
        const b = items[j];
        items[i] = b;
        items[j] = a;
    }
    return items;
}
/**
 * Builds a shuffled deck for one round.
 *
 * Every motif is laid down twice and the whole stack is shuffled afterwards,
 * so a pair can end up anywhere. The ids are handed out last, which makes an
 * id the card's place on the board.
 *
 * @param config - The settings the round runs on.
 * @returns The deck, face down.
 */
function buildDeck(config) {
    const pairs = pairCount(getBoardSize(config.size));
    const motifs = getTheme(config.theme).motifs;
    const draft = [];
    for (let pairId = 0; pairId < pairs; pairId++) {
        // every theme carries 18 motifs, which covers the largest board exactly
        const motif = motifs[pairId % motifs.length];
        draft.push({ pairId, motif, state: "hidden" });
        draft.push({ pairId, motif, state: "hidden" });
    }
    return shuffle(draft).map((card, id) => ({ ...card, id }));
}
/** One round of Memory: deck, scores and turn order. */
export class MemoryEngine {
    /** The settings this round was started with - a restart reuses them. */
    config;
    deck;
    totalPairs;
    /** Index of the card turned over first this turn, `null` before that. */
    firstPick = null;
    /** The wrong pair still face up, `null` while the board is free. */
    pendingMiss = null;
    matchedPairs = 0;
    scoreboard = { blue: 0, orange: 0 };
    activePlayer;
    constructor(config) {
        this.config = config;
        this.deck = buildDeck(config);
        this.totalPairs = this.deck.length / 2;
        this.activePlayer = config.startingPlayer;
    }
    /** The deck in board order, read-only - only the engine may change a card. */
    get cards() {
        return this.deck;
    }
    /** A copy of the scores, so a caller cannot count points for itself. */
    get scores() {
        return { ...this.scoreboard };
    }
    /** Whose turn it is. */
    get currentPlayer() {
        return this.activePlayer;
    }
    /** Locked while a wrong pair is still shown - clicks are ignored then. */
    get isLocked() {
        return this.pendingMiss !== null;
    }
    /** True once every pair has been found. */
    get isFinished() {
        return this.matchedPairs === this.totalPairs;
    }
    /**
     * Turns one card face up and applies the rules to it.
     *
     * @param index - Position of the card on the board.
     * @returns What happened, for the board to animate.
     */
    flip(index) {
        const card = this.pickable(index);
        if (card === null)
            return { kind: "ignored" };
        card.state = "revealed";
        if (this.firstPick === null) {
            this.firstPick = index;
            return { kind: "first", index };
        }
        const opener = this.firstPick;
        this.firstPick = null;
        return this.score(opener, index);
    }
    /**
     * The card a click is actually allowed to turn over.
     *
     * @param index - Position that was clicked.
     * @returns The card, or `null` if the click does not count: the board is
     * locked, the round is over, the index is out of range, or the card is
     * already face up.
     */
    pickable(index) {
        if (this.isLocked || this.isFinished)
            return null;
        const card = this.deck[index];
        if (card === undefined || card.state !== "hidden")
            return null;
        return card;
    }
    /**
     * Scores the second card of a turn against the first.
     *
     * A hit is kept on the board and the same player carries on; a miss leaves
     * both cards face up until the board calls {@link settle}.
     *
     * @param openerIndex - Card that was turned over first this turn.
     * @param index - Card that has just been turned over.
     * @returns The outcome, for the board to animate.
     */
    score(openerIndex, index) {
        const opener = this.deck[openerIndex];
        const card = this.deck[index];
        const indices = [openerIndex, index];
        if (opener.pairId !== card.pairId) {
            this.pendingMiss = indices;
            return { kind: "miss", indices };
        }
        opener.state = "matched";
        card.state = "matched";
        this.matchedPairs++;
        this.scoreboard[this.activePlayer]++;
        return { kind: "match", indices, player: this.activePlayer, finished: this.isFinished };
    }
    /**
     * Ends a missed turn: the two cards go face down and the other player is on.
     *
     * @returns Whether there was a miss to clean up at all, so a stray timer
     * cannot hand the turn on twice.
     */
    settle() {
        const pending = this.pendingMiss;
        if (pending === null)
            return false;
        for (const index of pending) {
            const card = this.deck[index];
            if (card !== undefined)
                card.state = "hidden";
        }
        this.pendingMiss = null;
        this.activePlayer = this.nextPlayer();
        return true;
    }
    /** Scores and winner; equal scores mean a draw. */
    get result() {
        const scores = this.scores;
        const best = Math.max(...TURN_ORDER.map((id) => scores[id]));
        const leaders = TURN_ORDER.filter((id) => scores[id] === best);
        return { scores, winner: leaders.length === 1 ? leaders[0] : null };
    }
    /** The player after the active one, wrapping around the table. */
    nextPlayer() {
        const current = TURN_ORDER.indexOf(this.activePlayer);
        return TURN_ORDER[(current + 1) % TURN_ORDER.length];
    }
}
//# sourceMappingURL=engine.js.map