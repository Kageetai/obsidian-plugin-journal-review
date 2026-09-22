import * as assert from "node:assert/strict";
import { test } from "node:test";
import { resolveNoteTitle } from "../src/noteTitle";

for (const title of [
	"A walk in the mountains",
	"  A walk  ",
	"日本語 🌄",
	"<b>title</b>",
	"**title**",
]) {
	void test(`uses a plain text YAML title: ${title}`, () => {
		assert.equal(resolveNoteTitle("2024-10-17", title, true), title.trim());
	});
}

for (const title of [
	undefined,
	null,
	"",
	" \n\t",
	42,
	false,
	true,
	["title"],
	{ title: "title" },
]) {
	void test(`falls back for an invalid YAML title: ${JSON.stringify(title)}`, () => {
		assert.equal(resolveNoteTitle("2024-10-17", title, true), "2024-10-17");
	});
}

void test("keeps the filename when YAML titles are disabled", () => {
	assert.equal(resolveNoteTitle("2024-10-17", "A walk", false), "2024-10-17");
});
