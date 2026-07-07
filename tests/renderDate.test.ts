import * as assert from "node:assert/strict";
import { test } from "node:test";
import type { moment } from "obsidian";

import {
	getDailyNoteRenderDate,
	getRenamedDailyNoteDate,
} from "../src/renderDate";

const selectedDate = { format: () => "2026-05-16" } as moment.Moment;
const renamedDate = { format: () => "2026-05-10" } as moment.Moment;

void test("uses the active daily note date in selected-note mode", () => {
	assert.equal(
		getDailyNoteRenderDate(renamedDate, selectedDate, true),
		selectedDate,
	);
});

void test("falls back to the old date when a rename no longer matches the daily-note format", () => {
	assert.equal(getRenamedDailyNoteDate(null, selectedDate), selectedDate);
});

void test("renders today when selected-note mode is disabled", () => {
	assert.equal(
		getDailyNoteRenderDate(renamedDate, selectedDate, false),
		undefined,
	);
});

void test("prefers the new daily note date after a conforming rename", () => {
	assert.equal(getRenamedDailyNoteDate(renamedDate, selectedDate), renamedDate);
});

void test("skips rendering when neither rename path is a daily note", () => {
	assert.equal(getRenamedDailyNoteDate(null, null), null);
	assert.equal(getDailyNoteRenderDate(null, selectedDate, true), null);
});
