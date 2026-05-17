import * as assert from "node:assert/strict";
import { test } from "node:test";
import type { moment } from "obsidian";

import { getDailyNoteRenderDate } from "../src/renderDate";

const selectedDate = { format: () => "2026-05-16" } as moment.Moment;

test("uses the daily note date when rendering from file changes in selected-note mode", () => {
	assert.equal(getDailyNoteRenderDate(selectedDate, true), selectedDate);
});

test("renders today when selected-note mode is disabled", () => {
	assert.equal(getDailyNoteRenderDate(selectedDate, false), undefined);
});

test("skips rendering for non-daily-note files", () => {
	assert.equal(getDailyNoteRenderDate(null, true), null);
});
