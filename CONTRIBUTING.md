# Contributing to Monyawn 🥱

We welcome contributions to Monyawn! To keep things running smoothly and maintain our "10/10" quality bar, please follow these guidelines.

## Local Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/cadguardianllc/sbs_opportunity_management_panel.git
    cd sbs_opportunity_management_panel
    ```
2.  **Run the setup script:** This script will install dependencies, create a `.env` file from `.env.example`, and set up Git hooks.
    ```bash
    bash scripts/setup.sh
    ```
3.  **Start the development server:**
    ```bash
    pnpm run dev
    ```
    The app should now be running at `http://localhost:5173`.

## Branch Naming Conventions

Please use the following conventions for your branch names:
-   `feat/<feature-name>` for new features.
-   `fix/<bug-description>` for bug fixes.
-   `docs/<doc-update>` for documentation changes.
-   `chore/<task-description>` for routine tasks, maintenance, or tooling.
-   `refactor/<refactor-description>` for code refactoring that doesn't change behavior.

## Test Requirements Before PR

All pull requests must pass the following checks:
1.  **Builds successfully:** `pnpm run build`
2.  **No lint errors:** `pnpm run lint`
3.  **All unit tests pass with coverage:** `pnpm run test:unit --coverage`
4.  **All browser tests pass:** `pnpm run test:browser:all`

You can run the full verification suite with `pnpm run verify`.

## Schema Change Governance

Any changes to the core workflow schema (e.g., adding/removing entities, changing enum values, modifying stage transitions) must be reviewed and approved by the relevant stakeholders as outlined in `docs/TECHNICAL_SPEC.md` under the "Schema Governance" section.

## Commit Message Format

We use a conventional commit format. Please adhere to the following structure:

```
<type>(<scope>): <subject>

<body>

<footer>
```

-   **`type`**: `feat`, `fix`, `docs`, `chore`, `style`, `refactor`, `perf`, `test`
-   **`scope` (optional)**: The part of the codebase affected (e.g., `api`, `ui`, `workflow`, `auth`).
-   **`subject`**: A brief, imperative description of the change (max 50 chars).
-   **`body` (optional)**: More detailed explanatory text, if necessary.
-   **`footer` (optional)**: Reference to issues (e.g., `Fixes #123`).

**Examples:**
-   `feat(workflow): implement AI checkpoint enforcement`
-   `fix(ui): resolve layout shift on mobile navigation`
-   `docs(setup): update contributing guide`

Thank you for contributing to Monyawn!
