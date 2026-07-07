# AGENTS.md

## Project Scope

This repository is an Obsidian community plugin named `journal-review`. It renders an "On this day" review of daily notes inside a custom sidebar view.

## Architecture

- Plugin entry point: `src/main.ts`
- Custom view: `src/view.tsx`
- Settings UI: `src/settingsTab.ts`
- Shared types and note-reduction logic: `src/constants.ts`
- Preact UI root: `src/components/Main.tsx`

## Development Workflow

- Use Node `>=20.11.0`; `.node-version` pins `20.11.0` for local version managers.
- Install deps: `npm ci`
- Dev build/watch: `npm run dev`
- Production build: `npm run build`
- Lint/static checks: `npm run lint`
- Format: `npm run format`
- Version bump for release: `npm run version`

## Repo-Specific Guidance

- Use CodeGraph first when you need to understand symbol relationships. This repo is indexed.
- Do not commit CodeGraph cache/runtime files from `.codegraph/`; only `.codegraph/.gitignore` belongs in git.
- Prefer small, targeted changes. The core behavior is concentrated in `src/main.ts`, `src/view.tsx`, `src/settingsTab.ts`, and `src/constants.ts`.
- Do not overwrite unrelated local changes. This repo may be dirty.
- `dist/` is build output. Edit source files under `src/` unless the task is explicitly about build artifacts.
- `vault/` is sample or local test data. Avoid broad changes there unless the task explicitly requires it.
- The plugin depends on Obsidian APIs, `obsidian-daily-notes-interface`, and Preact. Follow existing patterns before introducing new abstractions.
- `eslint-plugin-obsidianmd` enforces Obsidian plugin runtime constraints. Node-only utility scripts under `scripts/` may need scoped ESLint overrides instead of weakening rules for plugin source.

## Behavior Notes

- `JournalReviewPlugin.onload()` loads settings, registers the ribbon command, registers the custom view, and attaches notification/focus behavior.
- `OnThisDayView` listens for daily note create/delete/rename events and optionally rerenders on file switch.
- `reduceTimeSpans()` is the main data-shaping function for finding matching historical daily notes and injecting the optional random note.
- Settings writes should usually flow through `saveSettings()` so the view rerenders and listeners stay in sync.

## Validation

- For logic or UI changes, run `npm run build` at minimum.
- Run `npm run lint` when touching shared logic, settings, or multiple files.
- There are no dedicated tests in the repo today, so verification is mostly build/lint plus targeted manual reasoning.
