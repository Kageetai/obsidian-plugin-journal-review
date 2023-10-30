# Obsidian Plugin Journal Review

This is a plugin helping you "review" your daily notes on their anniversaries.

It pulls from all your daily notes (also using setting from the Periodic Notes plugin if present) and present notes from
the same day in previous time spans in a view, that can be activated via ribbon button or command palette.

## Installation

1. Find the under "Journal Review" in the community plugins list in Obsidian
2. Click "Install" and "Enable"
3. Configure "Options" to your liking

## Usage

Open the "On this day" view via the ribbon icon or the command palette, and it will display excerpts from previous daily
notes.
The view will refresh when a new daily note is created or around midnight to reflect the changes.

## Release

1. `npm run version` to update necessary manifest files
2. Push a new tag to GitHub with the corresponding version number
3. This automatically triggers a GitHub action that builds the plugin, creates a release and uploads the artifacts to
   the release

## Options

### Time Spans

Time spans to review, can be defined via three values: `number`, `unit` and `recurring`, meaning how many times of the
given unit to look back to, either once or recurring.

**Default (as configured via UI elements):**
```js
[
	{ number: 1, unit: Unit.month, recurring: false },
	{ number: 6, unit: Unit.month, recurring: false },
	{ number: 1, unit: Unit.year, recurring: true },
];
```

### Lookup Margin

The number of days to include before and after the date being checked

**Default:** `0`

### Preview Length

Length of the preview text to show for each note

**Default:** `200`
