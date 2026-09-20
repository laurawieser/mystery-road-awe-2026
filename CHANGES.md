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

## Demo 3 — Fix evidence loading state

### Change
Added an explicit setter for the Evidence loading state and update it after `evidence.json` has been loaded successfully.

### Code changes
- Added `setEvidenceViewLoading(value)` to `evidence.js`.
- Imported the setter into the data-loading module.
- Set `evidenceViewLoading` to `false` after `setAllEvidence(data)` in the successful Promise callback.

### Reason
The Evidence view remained in the loading state even after the evidence data had loaded.

### Verification
Confirmed that the Evidence list now renders after the fetch completes and that navigating away and back still works.

### Demo 4 — Fix silent navigation console error

Change

Changed the navigation button loop counter from var to let.

Before:

for (var i = 0; i < navButtons.length; i++) {
  navButtons[i].addEventListener("click", function () {
    var targetView = navButtons[i].getAttribute("data-view");
    console.log("nav clicked:", targetView);
  });
}

After:

for (let i = 0; i < navButtons.length; i++) {
  navButtons[i].addEventListener("click", function () {
    var targetView = navButtons[i].getAttribute("data-view");
    console.log("nav clicked:", targetView);
  });
}

Reason

The click callbacks all shared the same function-scoped var i. By the time a navigation button was clicked, the loop had already finished and i was equal to navButtons.length. Therefore navButtons[i] was undefined, which caused a console-only TypeError when .getAttribute() was called.

Verification

Opened DevTools Console, reloaded the application, clicked through all navigation buttons, and confirmed that the previous Cannot read properties of undefined (reading 'getAttribute') error no longer appears.

### Demo 5

### Bug 1
### Change
Moved the sorting logic into `getFilteredEvidence()` and applied it to the filtered `results` array before rendering.

### Reason
The previous implementation sorted `filteredEvidence`, but `renderEvidenceList()` immediately rebuilt that array, so the selected sort order was lost.


### Bug 2

### Change
Changed the Dashboard routing condition so that `renderDashboard()` runs every time the Dashboard is opened.

Before:

if (hash === "dashboard" && !viewRendered.dashboard) {
  renderDashboard();
  viewRendered.dashboard = true;
}

After: 
if (hash === "dashboard") {
  renderDashboard();
  viewRendered.dashboard = true;
}

### Bug 3 — Prevent duplicate modal click listeners

### Change
Moved the quick-view modal click handler into a separate `handleQuickViewClick()` function and attached it only when the modal element is created.

### Reason
Previously, `openEvidenceModal()` added a new click listener every time the modal was opened, causing multiple listeners to accumulate on the same modal element.

### Verification
Opened and closed the quick-view modal repeatedly and confirmed with a breakpoint that one click now executes the modal handler only once.
