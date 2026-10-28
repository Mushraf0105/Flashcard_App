// ==========================================
// 1. Flashcard Dataset (At least 10 cards)
// ==========================================
const initialFlashcards = [
  {
    category: "CSS 3D Transforms",
    question: "Which CSS property defines the distance between the user and the z=0 plane to create a 3D perspective?",
    answer: "The 'perspective' property (e.g., perspective: 1000px). It determines the intensity of the 3D depth effect for transformed child elements."
  },
  {
    category: "CSS 3D Transforms",
    question: "What CSS property ensures child elements remain positioned in 3D space rather than flattened into a 2D plane?",
    answer: "transform-style: preserve-3d. Without this, child elements are flattened into the parent's plane."
  },
  {
    category: "CSS3",
    question: "Which CSS property hides the reverse side of an element when rotated to face away from the screen?",
    answer: "backface-visibility: hidden. This allows the back face of a flashcard to only be visible when flipped 180 degrees."
  },
  {
    category: "JavaScript Basics",
    question: "What is the key difference between Array.prototype.map() and Array.prototype.forEach()?",
    answer: "map() returns a brand-new array containing transformed elements, whereas forEach() executes a callback function for side effects and returns undefined."
  },
  {
    category: "JavaScript Closures",
    question: "What is a closure in JavaScript?",
    answer: "A closure is a function bundled together with references to its surrounding lexical environment, allowing it to access outer variables even after the outer function has finished executing."
  },
  {
    category: "DOM & Events",
    question: "What is event bubbling in the browser DOM?",
    answer: "Event bubbling is the phase where an event triggers on the innermost target element and progressively propagates upward through ancestor elements in the DOM tree."
  },
  {
    category: "Web APIs & Storage",
    question: "How does localStorage differ from sessionStorage?",
    answer: "localStorage data persists indefinitely until cleared manually, whereas sessionStorage data is cleared as soon as the tab or browser session is closed."
  },
  {
    category: "CSS Layout",
    question: "When should you choose CSS Grid over Flexbox?",
    answer: "Use Flexbox for one-dimensional layouts (a single row OR column) and CSS Grid for two-dimensional layouts (rows AND columns simultaneously)."
  },
  {
    category: "JavaScript Async",
    question: "What are the three possible states of a JavaScript Promise?",
    answer: "1. Pending (initial state), 2. Fulfilled (completed successfully), and 3. Rejected (failed with an error)."
  },
  {
    category: "HTML5 Semantics",
    question: "Why should you use semantic HTML5 tags like <main>, <article>, and <nav> instead of plain <div>s?",
    answer: "Semantic HTML improves web accessibility for screen readers, enhances SEO parsing, creates structured document outlines, and makes code easier to maintain."
  },
  {
    category: "Algorithms",
    question: "How does the Fisher-Yates (Knuth) shuffle algorithm produce an unbiased random permutation?",
    answer: "It walks through the array in reverse, swapping each element with a randomly chosen element from indices 0 up to the current index in O(n) time."
  },
  {
    category: "JavaScript Runtime",
    question: "What is the primary role of the JavaScript Event Loop?",
    answer: "It continuously monitors the Call Stack and Task/Microtask queues. When the Call Stack is empty, it pushes pending queued callbacks to execute."
  }
];

// ==========================================
// 2. Application State
// ==========================================
// Working copy of flashcards (allows shuffling)
let flashcards = [...initialFlashcards];
let currentIndex = 0;
let isFlipped = false;

// ==========================================
// 3. DOM Element References
// ==========================================
const flashcardEl = document.getElementById("flashcard");
const cardQuestionEl = document.getElementById("card-question");
const cardAnswerEl = document.getElementById("card-answer");
const categoryFrontEl = document.getElementById("card-category-front");
const categoryBackEl = document.getElementById("card-category-back");

const progressTextEl = document.getElementById("progress-text");
const progressPercentEl = document.getElementById("progress-percent");
const progressBarFillEl = document.getElementById("progress-bar-fill");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const flipBtn = document.getElementById("flip-btn");
const shuffleBtn = document.getElementById("shuffle-btn");
const resetBtn = document.getElementById("reset-btn");

// ==========================================
// 4. Core Render & Navigation Functions
// ==========================================

/**
 * Renders the flashcard content based on the current state index
 * and updates the progress indicator.
 */
function renderCard() {
  const currentCard = flashcards[currentIndex];
  const totalCards = flashcards.length;

  // Update card face text
  cardQuestionEl.textContent = currentCard.question;
  cardAnswerEl.textContent = currentCard.answer;
  categoryFrontEl.textContent = currentCard.category;
  categoryBackEl.textContent = currentCard.category;

  // Calculate & update progress
  const currentNumber = currentIndex + 1;
  const percentage = Math.round((currentNumber / totalCards) * 100);

  progressTextEl.textContent = `Card ${currentNumber} of ${totalCards}`;
  progressPercentEl.textContent = `${percentage}% Complete`;
  progressBarFillEl.style.width = `${(currentNumber / totalCards) * 100}%`;

  // Update navigation button states
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === totalCards - 1;
}

/**
 * Toggles the 3D flip animation between question and answer
 */
function flipCard() {
  isFlipped = !isFlipped;
  flashcardEl.classList.toggle("is-flipped", isFlipped);
  flashcardEl.setAttribute("aria-pressed", isFlipped.toString());
}

/**
 * Unflips the card back to the front side smoothly if currently showing the back
 */
function resetCardFlip() {
  if (isFlipped) {
    isFlipped = false;
    flashcardEl.classList.remove("is-flipped");
    flashcardEl.setAttribute("aria-pressed", "false");
  }
}

/**
 * Navigates to the next card in the deck
 */
function goToNextCard() {
  if (currentIndex < flashcards.length - 1) {
    resetCardFlip();
    // Allow brief time for flip reset transition before updating content
    setTimeout(() => {
      currentIndex++;
      renderCard();
    }, 150);
  }
}

/**
 * Navigates to the previous card in the deck
 */
function goToPrevCard() {
  if (currentIndex > 0) {
    resetCardFlip();
    setTimeout(() => {
      currentIndex--;
      renderCard();
    }, 150);
  }
}

/**
 * Shuffles the deck using the Fisher-Yates algorithm
 */
function shuffleDeck() {
  resetCardFlip();

  // Modern Fisher-Yates shuffle
  for (let i = flashcards.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [flashcards[i], flashcards[randomIndex]] = [flashcards[randomIndex], flashcards[i]];
  }

  currentIndex = 0;
  setTimeout(() => {
    renderCard();
  }, 150);
}

/**
 * Resets the deck order back to initial state
 */
function resetDeck() {
  resetCardFlip();
  flashcards = [...initialFlashcards];
  currentIndex = 0;
  setTimeout(() => {
    renderCard();
  }, 150);
}

// ==========================================
// 5. Event Listeners & Keyboard Controls
// ==========================================

// Click on the flashcard itself to flip
flashcardEl.addEventListener("click", flipCard);

// Navigation & action buttons
flipBtn.addEventListener("click", flipCard);
nextBtn.addEventListener("click", goToNextCard);
prevBtn.addEventListener("click", goToPrevCard);
shuffleBtn.addEventListener("click", shuffleDeck);
resetBtn.addEventListener("click", resetDeck);

// Keyboard controls for accessibility and ease of use
document.addEventListener("keydown", (event) => {
  // Prevent default spacebar page scrolling
  if (event.code === "Space" && event.target === document.body) {
    event.preventDefault();
  }

  switch (event.code) {
    case "Space":
    case "Enter":
      // Flip if space/enter pressed
      if (document.activeElement === flashcardEl || event.target === document.body) {
        event.preventDefault();
        flipCard();
      }
      break;

    case "ArrowRight":
      goToNextCard();
      break;

    case "ArrowLeft":
      goToPrevCard();
      break;

    case "KeyS":
      shuffleDeck();
      break;

    default:
      break;
  }
});

// ==========================================
// 6. Initial App Boot
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  renderCard();
});
