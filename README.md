# Obsidian Plugin Journal Review

This is a plugin helping you "review" your daily notes on their anniversaries.

It pulls from all your daily notes (also using setting from the Periodic Notes plugin if present) and present notes from
the same day in previous time spans in a view, that can be activated via ribbon button or command palette.

## Installation

1. Find the under "Journal Review" in the community plugins list in Obsidian
2. Click "Install" and "Enable"
3. Configure "Options" to your liking

## Usage

Open the "On this day" view via the ribbon icon or the command palette and it will display excerpts from previous daily notes.
The view will refresh when a new daily note is created or around midnight to reflect the changes.

## Options

### Time Spans

Time spans to review, one per line, in the format "number unit", with unit being one of "days", "weeks", "months" or "
years", see here for more info: https://momentjs.com/docs/#/durations/

#### Default

```
1 months
6 months
1 years
2 years
3 years
```

### Lookup Margin

The number of days to include before and after the date being checked

#### Default

`0`

### Preview Length

Length of the preview text to show for each note

#### Default

`200`
