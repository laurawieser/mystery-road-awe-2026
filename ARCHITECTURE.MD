# Architecture – Demo 6

We organized our React application using a **feature-oriented folder structure**. Components are grouped by their functionality into `dashboard/`, `people-locations/`, and `timeline/`, while page components are kept separately in `pages/`.

Our rule was to keep components **feature-local** if they belong to a specific feature. Reusable UI components are placed in `UI/`, while application-wide components like `Header` and `Navigation` belong in `layout/`.

We chose this structure to improve maintainability, keep related code together, and make the application easier to extend and reuse.

