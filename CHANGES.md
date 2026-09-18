# CHANGES.md

## Demo 1 — Split the app into JavaScript modules

### Changes made
- Split the original large `app.js` into native ES modules based on responsibility.
- Moved shared application state into `state.js`.
- Moved lookup helpers into `lookup.js`.
- Moved utility/formatting functions into `utils.js`.
- Moved storage-related functionality into `storage.js`.
- Split view-specific logic into separate modules such as `evidence.js`, `timeline.js`, etc.
- Kept a small entry-point module responsible for startup/navigation/event wiring.
- Updated `index.html` to load the application with `<script type="module">`.
- Kept temporary `window.*` bridges where required by existing inline HTML event handlers.

### Why
The original file mixed state, data handling, rendering, navigation, storage and event logic. Splitting it by responsibility makes the code easier to understand and maintain while introducing native ES module boundaries.

### Verification
- Ran the application repeatedly during the refactor.
- Confirmed that the existing behavior remained unchanged.
- Intentionally did **not** fix pre-existing bugs during Demo 1.

---

## UI changes

### What I changed
- Applied the UI changes completed before starting the bug-fix demos.

### Why
These were presentation/UI changes only and were kept separate from the debugging work.

### Verification
- Checked that navigation and the existing views still render as before.
- No known application-logic bugs were intentionally fixed as part of these changes.

