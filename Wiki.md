# Todoist Clone — Wiki

## Overview

This is a React-based clone of the [Todoist](https://todoist.com) task-management app, built as a learning project following the [CognitiveSurge YouTube tutorial series](https://www.youtube.com/c/CognitiveSurge). It is aimed at developers who want to study how a real-world React application is structured, including component composition, the Context API, custom hooks, Firebase Firestore integration, and SCSS styling.

Key features:

- Create and delete **projects** and **tasks** stored in Firebase Firestore.
- Three built-in **collated views**: Inbox, Today, and Next 7 Days.
- **Task dates** (Today, Tomorrow, Next Week) powered by [moment.js](https://momentjs.com).
- **Dark mode** toggled by clicking the pizza-slice icon (🍕) in the header.
- **Archive tasks** by clicking the checkbox next to a task.

> **Note:** There is no user authentication. The `userId` is hardcoded in `src/hooks/index.js`. All data in Firestore is shared under that single user ID.

---

## Architecture

```
todoist/
├── public/                  Static assets and index.html
└── src/
    ├── App.js               Root component — dark mode state, context providers
    ├── App.scss             All application styles (SCSS variables, mixins, components)
    ├── index.js             React DOM entry point
    ├── firebase.js          Firebase initialisation (created from firebase.js.example)
    ├── __tests__/           Jest + @testing-library/react spec files (one per component)
    ├── components/
    │   ├── layout/
    │   │   ├── Content.js   Wraps Sidebar + Tasks side by side
    │   │   ├── Header.js    Top bar with dark mode toggle
    │   │   └── Sidebar.js   Project list and collated-task links
    │   ├── AddProject.js    Inline form to create a new project
    │   ├── AddTask.js       Inline and quick-add form to create a task
    │   ├── Checkbox.js      Marks a task complete (archives it in Firestore)
    │   ├── IndividualProject.js  Single project row with delete action
    │   ├── ProjectOverlay.js     Dropdown to pick a project when adding a task
    │   ├── Projects.js      Renders the list of user projects in the sidebar
    │   ├── TaskDate.js      Date-picker overlay (Today / Tomorrow / Next Week)
    │   └── Tasks.js         Renders the task list for the selected project/view
    ├── constants/
    │   └── index.js         Collated task definitions: INBOX, TODAY, NEXT_7
    ├── context/
    │   ├── ProjectsContext.js        Provides projects array to the tree
    │   └── SelectedProjectContext.js Provides/sets the active project or view
    ├── helpers/
    │   └── index.js         getTitle, collatedTasksExist, generatePushId utilities
    └── hooks/
        └── index.js         useTasks and useProjects — Firestore data fetching
```

### Data flow

1. `App.js` wraps the tree in `ProjectsProvider` and `SelectedProjectProvider`.
2. `Sidebar` reads the projects list from `ProjectsContext` and lets the user pick a project or collated view, writing the selection into `SelectedProjectContext`.
3. `Tasks` reads `SelectedProjectContext` to know which tasks to fetch from Firestore via the `useTasks` hook.
4. `AddTask` and `AddProject` write directly to Firestore; the hooks' `onSnapshot` listeners update the UI in real time.

---

## Getting Started

### Prerequisites

- **Node.js** (LTS recommended) and **Yarn**.
- A **Firebase** project with Firestore enabled.

### 1 — Configure Firebase

Copy the example config file and fill in your Firebase project credentials:

```bash
cp src/firebase.js.example src/firebase.js
```

Edit `src/firebase.js` and replace the placeholder values with the keys from your Firebase console (`apiKey`, `authDomain`, `databaseURL`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`).

### 2 — Install dependencies

```bash
yarn install
```

### 3 — Start the development server

```bash
yarn start
```

The app opens at `http://localhost:3000` with hot reload.

### 4 — Run the tests

```bash
# Interactive watch mode
yarn test

# Single run with coverage report
yarn test --coverage
```

Coverage thresholds are set at **90 %** for branches, functions, lines, and statements. The `hooks/` and `context/` directories are excluded from coverage collection.

### 5 — Production build

```bash
yarn build
```

Outputs a minified static bundle to `build/`. Deploy to any static host (Netlify, Vercel, Firebase Hosting, etc.).

---

## Key Decisions

### Single SCSS file

All styles live in `src/App.scss`. SCSS variables (`$generic-bg`, `$generic-border`, `$generic-box-shadow`) and mixins keep repetition low. There are no CSS Modules or styled-components — keep new styles in `App.scss` and follow the existing variable/mixin conventions.

### Context API over Redux

Global state (the project list and the selected project) is managed with React's built-in Context API and custom hooks. There is no Redux or other state library. Add new shared state by extending the existing contexts or adding a new context/provider pair.

### Custom hooks for Firestore

`useTasks` and `useProjects` in `src/hooks/index.js` own all Firestore reads. Components never import `firebase` directly — they call a hook. Write new data-fetching logic as a hook in the same file.

### Hardcoded `userId`

Authentication is not implemented. The string `'jlIFXIwyAL3tzHMtzRbw'` is used as the Firestore user ID in `src/hooks/index.js`. Every document is scoped to this ID. If you add authentication, replace this constant with the real UID from Firebase Auth.

### Airbnb ESLint + Prettier

The project enforces the Airbnb ESLint ruleset with Prettier formatting (single quotes, trailing commas in ES5 positions, 80-character print width). Run `yarn lint` (or let your editor's ESLint integration) catch issues before committing.

### `generatePushId` instead of Firestore auto-IDs

New tasks and projects get their IDs from the local `generatePushId` helper rather than Firestore's `add()` method. This keeps IDs predictable in tests and avoids an extra round-trip.

---

## Known Issues

| # | Description |
|---|-------------|
| 1 | **No accessibility support.** ARIA roles and keyboard navigation are largely absent. The README explicitly lists this as an open contribution opportunity. |
| 2 | **Hardcoded user ID.** There is no login flow; all data belongs to one fixed Firestore user. Multi-user support would require Firebase Authentication. |
| 3 | **`firebase.js` not committed.** The real config file is git-ignored. New contributors must create it manually from `src/firebase.js.example` before the app will run. |
| 4 | **Single monolithic stylesheet.** All styles are in one `App.scss` file, which may become hard to maintain as the component count grows. |
| 5 | **`yarn test` runs in watch mode by default.** The `test` script passes `--watchAll`, so CI pipelines should run `yarn test --watchAll=false` (or `yarn test --coverage`) to get a single-pass exit code. |
