# Optional YAML Note Titles — Feasibility and Proposed Plan

**Issue:** https://github.com/Kageetai/obsidian-plugin-journal-review/issues/276

**Status:** Implemented on `codex/yaml-note-titles`; automated checks and browser-harness checks passed. Manual Obsidian checks remain.

**Goal:** Let daily notes retain date-based filenames while displaying their YAML `title` in Journal Review.

## Feasibility

This is a bounded, low-risk feature. `src/components/NotePreview.tsx` renders `note.basename` in two places: callout headings and ordinary headings. Both can use one resolved display title. Opening a note already uses its `TFile`, independently of its display text.

The installed Obsidian API provides `app.metadataCache.getFileCache(note)?.frontmatter` and a `changed` event fired after metadata indexing. No YAML parser or other dependency is needed. `loadSettings()` merges saved settings with defaults, so a new disabled-by-default setting requires no migration.

The repository has `npm test` and `tests/renderDate.test.ts`, despite the older project guidance saying there are no dedicated tests.

## Proposed behavior

- Add **Use YAML title** next to **Show note title with previews**, disabled by default.
- Description: “Use the note’s YAML title property when available. Otherwise, show the file name.”
- Read the exact lowercase `title` property. Accept nonempty strings and trim surrounding whitespace.
- Fall back to `note.basename` for missing metadata, missing properties, empty/whitespace strings, null, numbers, booleans, arrays, or objects.
- Render the title as plain text in both display styles. Markdown and HTML in a title remain literal text.
- The existing show/hide title setting remains authoritative.
- Editing or removing the title updates a visible preview once Obsidian indexes the change.
- Note opening, daily-note recognition, date grouping, and random-note selection keep their existing behavior.

For example, `2024-10-17.md` with `title: A walk in the mountains` displays **A walk in the mountains** when enabled and **2024-10-17** when disabled.

## Alternatives

1. **Optional fixed `title` property — recommended.** Matches the issue, preserves existing defaults, and keeps the settings simple.
2. **Always prefer YAML titles.** Less settings UI, but changes behavior for existing users.
3. **Configurable property name.** Supports custom conventions, but adds configuration and testing beyond the reported need. Defer unless requested.

## Implementation steps

### 1. Define and test title resolution

**Create:** `src/noteTitle.ts`, `tests/noteTitle.test.ts`.

- [x] Add a pure helper with no runtime Obsidian dependency:

```ts
export const resolveNoteTitle = (
	basename: string,
	frontmatterTitle: unknown,
	useFrontmatterTitle: boolean,
): string => {
	if (useFrontmatterTitle && typeof frontmatterTitle === "string") {
		return frontmatterTitle.trim() || basename;
	}
	return basename;
};
```

- [x] Before implementation, write table-driven tests using the existing Node test runner. Cover enabled and disabled settings, trimmed strings, all fallback classes above, Unicode, and literal `<b>title</b>` / `**title**` text.
- [x] Run `npm test` before and after adding the helper to establish failure and then success.

### 2. Wire the setting into both preview styles

**Modify:** `src/constants.ts`, `src/settingsTab.ts`, `src/components/NotePreview.tsx`.

- [x] Add `useFrontmatterTitle: boolean` to `Settings` and `useFrontmatterTitle: false` to `DEFAULT_SETTINGS`.
- [x] Add the toggle using the existing `.addSetting()` / `.addToggle()` pattern. Persist through `saveSettings()`.
- [x] Resolve one display title from the basename, cached `frontmatter.title` treated as `unknown`, and the setting. Replace both heading expressions with that title, retaining `showNoteTitle` and the existing file-opening handler.
- [x] Check that a saved configuration without the new property still displays filenames (source inspection of the existing defaults merge).

### 3. Keep visible titles current

**Modify:** `src/components/NotePreview.tsx`, `src/view.tsx`.

- [x] Use component state/effect to subscribe to metadata `changed` events for the preview’s own note. Refresh its title from the newly indexed metadata; refresh once after subscription to cover metadata becoming available during mounting.
- [x] Clean up the subscription when the note/component changes or unmounts. Recalculate correctly when the preference changes or the file is renamed.
- [x] Unmount the Preact tree with `render(null, container)` in `OnThisDayView.onClose()` so component subscriptions are released when the view closes.
- [x] Update only the affected preview, without calling `reduceTimeSpans()` or resetting the reference date. A title edit must not reroll the random note.

### 4. Validate and document

**Modify:** `README.md` beside the existing title-display setting.

- [x] Document the toggle, lowercase `title` property, and filename fallback with a short YAML example.
- [x] Run `npm test`, `npm run build`, and `npm run lint`.
- [ ] In Obsidian, check both callout and ordinary previews; title visibility on/off; preference on/off; and note opening including modifier/middle clicks.
- [ ] While the sidebar is open, add, edit, and remove a YAML title. Check initial cache availability, duplicate titles on different files, and file renaming.
- [ ] Confirm editing a title preserves the selected review date and random note. Close/reopen the view and disable/re-enable the plugin to check subscription cleanup.

## Scope and remaining uncertainty

No blocker was found in source/API inspection. Runtime verification in Obsidian is still required, particularly metadata timing and view cleanup. The existing asynchronous preview-body rendering is outside this feature’s scope unless targeted checks expose a regression caused by the change.

## Implementation decisions and verification

- Live updates live in a new `src/components/NoteTitle.tsx` child component. This small refinement isolates refreshes from the preview body's existing asynchronous rendering as well as from the review list. A browser check confirmed title changes do not trigger another body read.
- Closing the view also cancels its queued debounced render before unmounting, preventing a queued render from recreating subscriptions after close.
- Work uses a feature branch in the existing checkout. No dependencies, user notes, or CodeGraph cache files were added to the change.
- All 20 Node tests passed, including 15 new title-resolution cases; production build and lint passed.
- A temporary headless Chrome harness exercised the actual Preact preview components against a simulated Obsidian API. All 14 checks passed: initial cache fallback, subscription count, late metadata, isolated updates, escaped HTML, unrelated-note filtering, removed-title fallback, ordinary preview updates, opening the original file, disabling/re-enabling the preference, hiding titles, unmount cleanup, and remount subscription count.
- An independent read-only code review found no actionable correctness issues. Actual Obsidian metadata timing, plugin disable/re-enable, and the manual checks above have not been exercised in the application.
