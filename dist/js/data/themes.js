/**
 * The motif sets behind the three game themes.
 *
 * Each theme owns 18 motifs, which is exactly what the largest board needs:
 * 6x6 is 36 cards, so 18 pairs. Smaller boards draw a subset of the same set.
 *
 * Colors are deliberately not stored here. The board carries a `data-theme`
 * attribute and the SCSS picks the scheme up from there, so every hex value
 * lives in exactly one place.
 */
/** Where the motif files sit, relative to `index.html`. */
const ICON_ROOT = "assets/icons";
/** Tech logos. Brand marks from Simple Icons, each in its own brand color. */
const CODE_VIBES_MOTIFS = [
    { id: "git", label: "Git" },
    { id: "typescript", label: "TypeScript" },
    { id: "javascript", label: "JavaScript" },
    { id: "html5", label: "HTML5" },
    { id: "css", label: "CSS" },
    { id: "sass", label: "Sass" },
    { id: "react", label: "React" },
    { id: "vue", label: "Vue.js" },
    { id: "angular", label: "Angular" },
    { id: "node", label: "Node.js" },
    { id: "npm", label: "npm" },
    { id: "bootstrap", label: "Bootstrap" },
    { id: "python", label: "Python" },
    { id: "django", label: "Django" },
    { id: "github", label: "GitHub" },
    { id: "firebase", label: "Firebase" },
    { id: "bash", label: "GNU Bash" },
    { id: "postgresql", label: "PostgreSQL" },
];
/** Arcade and board game motifs. */
const GAMING_MOTIFS = [
    { id: "gamepad", label: "Game controller" },
    { id: "joystick", label: "Joystick" },
    { id: "alien", label: "Alien monster" },
    { id: "dice", label: "Dice" },
    { id: "puzzle", label: "Puzzle piece" },
    { id: "trophy", label: "Trophy" },
    { id: "medal", label: "Gold medal" },
    { id: "star", label: "Star" },
    { id: "mushroom", label: "Mushroom" },
    { id: "banana", label: "Banana" },
    { id: "ghost", label: "Ghost" },
    { id: "gem", label: "Gem" },
    { id: "dart", label: "Dartboard" },
    { id: "slot-machine", label: "Slot machine" },
    { id: "eight-ball", label: "Eight ball" },
    { id: "bowling", label: "Bowling" },
    { id: "coin", label: "Coin" },
    { id: "pawn", label: "Chess pawn" },
];
/** Food motifs. */
const FOODS_MOTIFS = [
    { id: "fries", label: "Fries" },
    { id: "pizza", label: "Pizza" },
    { id: "sandwich", label: "Sandwich" },
    { id: "donut", label: "Donut" },
    { id: "sushi", label: "Sushi" },
    { id: "hot-dog", label: "Hot dog" },
    { id: "burger", label: "Burger" },
    { id: "pretzel", label: "Pretzel" },
    { id: "cupcake", label: "Cupcake" },
    { id: "flan", label: "Flan" },
    { id: "chocolate", label: "Chocolate bar" },
    { id: "chicken", label: "Fried chicken" },
    { id: "taco", label: "Taco" },
    { id: "ice-cream", label: "Ice cream" },
    { id: "salad", label: "Salad" },
    { id: "popcorn", label: "Popcorn" },
    { id: "croissant", label: "Croissant" },
    { id: "cake", label: "Cake" },
];
/** Every theme the settings screen offers, in the order it lists them. */
export const THEMES = [
    { id: "code-vibes", label: "Code vibes theme", motifs: CODE_VIBES_MOTIFS },
    { id: "gaming", label: "Gaming theme", motifs: GAMING_MOTIFS },
    { id: "foods", label: "Foods theme", motifs: FOODS_MOTIFS },
];
/**
 * Looks a theme up by its id.
 *
 * @param id - The theme picked in the settings.
 * @returns The matching theme.
 * @throws If no theme carries that id, which means the markup and this
 * module have drifted apart.
 */
export function getTheme(id) {
    const theme = THEMES.find((candidate) => candidate.id === id);
    if (!theme) {
        throw new Error(`Unknown theme: ${id}`);
    }
    return theme;
}
/**
 * Builds the file path of a motif image.
 *
 * @param themeId - The theme the motif belongs to.
 * @param motifId - The motif's own id, which doubles as its file name.
 * @returns A path usable as an `src`, e.g. `assets/icons/foods/pizza.svg`.
 */
export function motifSrc(themeId, motifId) {
    return `${ICON_ROOT}/${themeId}/${motifId}.svg`;
}
//# sourceMappingURL=themes.js.map