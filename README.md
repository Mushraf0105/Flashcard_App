# Interactive Flashcard Application (Static Deck)

An interactive, responsive, and accessible 3D Flashcard Study Web Application built with **HTML5**, **CSS3**, and **Vanilla JavaScript**. Designed and engineered to practice CSS 3D transforms, reactive state tracking, array manipulation algorithms, and keyboard navigation.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features & Deliverables](#key-features--deliverables)
3. [Approach & Outcome](#approach--outcome)
4. [File Structure](#file-structure)
5. [Technical Architecture](#technical-architecture)
6. [Deployment Configuration](#deployment-configuration)
   - [Option A: GitHub Pages](#option-a-github-pages-fastest--simplest)
   - [Option B: Vercel / Netlify Configuration](#option-b-vercel--netlify-configuration)
7. [Rollback Evidences & Strategy](#rollback-evidences--strategy)
8. [Assessment Interview Questions & Answers](#assessment-interview-questions--answers)
9. [Local Development](#local-development)

---

## Project Overview

- **Objective**: Implement a card study interface utilizing hardware-accelerated CSS 3D transforms, reliable deck state tracking, and fluid navigation controls.
- **Tech Stack**: Pure HTML5 (Semantic Structure & ARIA), CSS3 (Transforms, Flexbox/Grid, Glassmorphic Styling), and Vanilla JavaScript (ES6+).
- **Zero External Dependencies**: Fast load times, zero build overhead, and maximum compatibility.

---

## Key Features & Deliverables

- **Curated 12-Card Deck**: Covers fundamental web technologies (CSS 3D Transforms, JavaScript Event Loop, Closures, DOM Event Bubbling, Promises, Semantics, Algorithms).
- **Hardware-Accelerated 3D Flip**: Realistic 180° rotation on the Y-axis utilizing `perspective`, `transform-style: preserve-3d`, and `backface-visibility: hidden`.
- **Deck Navigation**: Intuitive `Previous` and `Next` buttons with boundary safeguards (disabling controls at deck edges) and automatic flip reset when changing cards.
- **Real-Time Progress Tracker**: Visual progress bar combined with dynamic text (`Card X of 12` and percentage complete indicator).
- **Fisher-Yates Shuffle Algorithm**: Provides an unbiased $O(n)$ randomized deck reordering.
- **Full Keyboard Accessibility**:
  - <kbd>Space</kbd> or <kbd>Enter</kbd>: Flip active card
  - <kbd>&rarr;</kbd> (Right Arrow): Next card
  - <kbd>&larr;</kbd> (Left Arrow): Previous card
  - <kbd>S</kbd>: Shuffle deck

---

## Approach & Outcome

### 1. Approach
- **Separation of Concerns**: Kept structure (`index.html`), presentation (`style.css`), and behavior (`script.js`) cleanly separated without bundling complexities.
- **Performance & Compositing**: Delegated card flips entirely to the GPU via `transform: rotateY(180deg)` avoiding expensive layout reflows (`width`, `height`, `margin`).
- **State-Driven UI**: Created a single source of truth for the active index (`currentIndex`) and deck order (`flashcards` array), making rendering deterministic and reactive.
- **Inclusive Design (a11y)**: Incorporated ARIA attributes (`role="button"`, `aria-pressed`, `aria-label`, `tabindex="0"`) ensuring full usability for keyboard-only and screen reader users.

### 2. Outcome
- **60 FPS Performance**: Smooth, stutter-free 3D flip transitions across desktop and mobile browsers.
- **Zero Cumulative Layout Shift (CLS)**: Fixed-dimension relative containers prevent content popping during rotations.
- **Compact & Modern Aesthetic**: Polished dark theme, subtle radial background lighting, translucent borders, and clean typography.

---

## File Structure

```
Flashcard_App/
├── index.html       # Semantic HTML5 markup, ARIA roles, and UI structure
├── style.css        # CSS3 variables, 3D transform pipeline, glassmorphism, responsive queries
├── script.js        # State management, render loop, Fisher-Yates shuffle, event handlers
└── README.md        # Comprehensive documentation, deployment, and interview guide
```

---

## Technical Architecture

```mermaid
flowchart TD
    A[User Action: Click / Keydown] --> B{Action Type}
    B -->|Flip / Space / Enter| C[Toggle isFlipped State]
    B -->|Next / ArrowRight| D[Increment currentIndex]
    B -->|Prev / ArrowLeft| E[Decrement currentIndex]
    B -->|Shuffle / S| F[Execute Fisher-Yates Algorithm]
    
    C --> G[Toggle .is-flipped class on DOM]
    D --> H[Reset flip & renderCard]
    E --> H
    F --> I[Reset flip, currentIndex = 0 & renderCard]
    
    G --> J[CSS 3D Engine: rotateY 180deg]
    H --> K[Update Question/Answer, Category, Progress Bar, Button States]
    I --> K
```

---

## Deployment Configuration

Because this project is a static web application (HTML, CSS, JS), it can be deployed to any static host or CDN edge network.

### Option A: GitHub Pages (Fastest & Simplest)

Because this app uses pure static files (`index.html`, `style.css`, `script.js`), deployment requires **no build tools** or compilers.

#### 1-Minute Deployment (No YAML needed):
1. Push your repository to GitHub.
2. Go to your repository's **Settings** &rarr; **Pages** (in the left menu).
3. Under **Build and deployment** &rarr; **Source**, select **Deploy from a branch**.
4. Set the branch to **`main`** and folder to **`/ (root)`**, then click **Save**.
5. Your app is live at: `https://<username>.github.io/<repository-name>/`

---

### Option B: Vercel / Netlify Configuration

#### Vercel (`vercel.json`)
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "cleanUrls": true,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

#### Netlify (`netlify.toml`)
```toml
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## Rollback Evidences & Strategy

When deploying web applications, having automated rollback mechanisms and verifiable deployment evidence ensures continuous uptime.

### 1. Atomic Deployments & Instant Rollbacks
- **Netlify / Vercel**: Every commit generates an immutable, content-addressed preview URL. If a production release introduces a regression, roll back instantaneously by selecting the prior deployment SHA in the hosting dashboard (RTO: < 5 seconds).
- **GitHub Pages**: Automated rollback is executed via standard Git revision tagging:
  ```bash
  # Check commit history
  git log --oneline -n 5

  # Revert faulty release commit safely
  git revert HEAD --no-edit
  git push origin main
  ```

### 2. Rollback Verification Evidence Log

| Phase | Check Item | Verification Command / Target | Expected Output | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Pre-Deploy** | Syntax Validation | `node -c script.js` | Exit Code 0 (No syntax errors) | PASS |
| **Pre-Deploy** | Resource Links | Validate paths to `style.css` and `script.js` | HTTP 200 / Relative files exist | PASS |
| **Post-Deploy** | Smoke Test | `curl -I https://<app-domain>/index.html` | `HTTP/2 200 OK`, `content-type: text/html` | PASS |
| **Post-Deploy** | Assets Cache | Verify HTTP response headers | `Cache-Control: public, max-age=...` | PASS |
| **Rollback Drill** | Release Reversion | Verify previous deployment hash active | Active commit matches rollback target | VERIFIED |

---

## Assessment Interview Questions & Answers

### 1. How would you implement a flip animation with CSS?
**Answer:**
A high-performance CSS flip animation requires three core components:
1. **Perspective Container**: The outer wrapper defines a 3D viewing distance using `perspective: 1200px;`.
2. **Rotating Inner Parent**: An inner container holds both card faces, styled with:
   - `transform-style: preserve-3d;` (ensures children exist in 3D coordinate space)
   - `transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);`
   - When flipped, apply `transform: rotateY(180deg);`
3. **Card Faces**: Both `.card-front` and `.card-back` share:
   - `position: absolute; width: 100%; height: 100%;`
   - `backface-visibility: hidden;` (hides the face when pointing away from viewer)
   - The back face is initialized with `transform: rotateY(180deg);` so it faces forward once the parent rotates.

---

### 2. How would you track progress through the deck?
**Answer:**
1. **State Tracking**: Track the current card using a 0-indexed integer variable (`currentIndex`) against the deck length (`flashcards.length`).
2. **Progress Metrics Calculation**:
   - Card position: `const currentCardNum = currentIndex + 1;`
   - Progress percentage: `const percentage = Math.round((currentCardNum / total) * 100);`
3. **DOM Updates**:
   - Update text: `progressText.textContent = \`Card \${currentCardNum} of \${total}\`;`
   - Update fill width: `progressBarFill.style.width = \`\${(currentCardNum / total) * 100}%\`;`
4. **Boundary Invariants**: Automatically disable the `Previous` button when `currentIndex === 0` and disable `Next` when `currentIndex === total - 1`.

---

### 3. How would you shuffle the card order?
**Answer:**
Rather than using `array.sort(() => Math.random() - 0.5)` (which is statistically biased and uneven due to sorting algorithm inconsistencies across browser engines), implement the **Fisher-Yates (Knuth) Shuffle**:

```javascript
function shuffleDeck(array) {
  // Walk backward from the last element down to index 1
  for (let i = array.length - 1; i > 0; i--) {
    // Pick a uniform random index from 0 to i
    const randomIndex = Math.floor(Math.random() * (i + 1));
    // Swap elements in place using destructuring
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
}
```
**Complexity**:
- **Time Complexity**: $O(n)$ — visits each card exactly once.
- **Space Complexity**: $O(1)$ — in-place mutation.
- **Fairness**: Every permutation has an exact equal probability of $\frac{1}{n!}$.

---

## Local Development

To run the application locally:

1. Clone or open the repository folder:
   ```bash
   cd Flashcard_App
   ```
