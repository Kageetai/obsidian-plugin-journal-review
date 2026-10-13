import * as assert from "node:assert/strict";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { buildSync } from "esbuild";
import type {
	App,
	SettingDefinitionGroup,
	SettingDefinitionList,
} from "obsidian";
import type JournalReviewPlugin from "../src/main";
import type { SettingsTab as SettingsTabType } from "../src/settingsTab";

const moduleExports = {
	exports: {} as { SettingsTab: typeof SettingsTabType },
};
runInNewContext(
	buildSync({
		entryPoints: ["src/settingsTab.ts"],
		bundle: true,
		write: false,
		platform: "node",
		format: "cjs",
		external: ["obsidian", "obsidian-daily-notes-interface"],
	}).outputFiles[0].text,
	{
		module: moduleExports,
		exports: moduleExports.exports,
		DocumentFragment: class {
			textContent = "";
			createEl() {}
		},
		require: (name: string) => {
			if (name === "obsidian-daily-notes-interface") return {};
			assert.equal(name, "obsidian");
			return {
				PluginSettingTab: class {
					getSettingDefinitions() {
						return [];
					}
					setControlValue() {}
					update() {}
					refreshDomState() {}
				},
				debounce: (callback: unknown) => callback,
			};
		},
	},
);
const { SettingsTab } = moduleExports.exports;

const createTab = () => {
	let saves = 0;
	const plugin = {
		settings: {
			timeSpans: [{ number: 2, unit: "week", recurring: true }],
			useCallout: true,
			useQuote: true,
		},
		async saveSettings() {
			saves++;
		},
	} as unknown as JournalReviewPlugin;
	return {
		tab: new SettingsTab({} as App, plugin),
		plugin,
		get saves() {
			return saves;
		},
	};
};

void test("declarative setting changes persist through the plugin save path", async () => {
	const fixture = createTab();
	await fixture.tab.setControlValue("useCallout", false);
	assert.equal(fixture.plugin.settings.useCallout, false);
	assert.equal(fixture.plugin.settings.useQuote, true);
	assert.equal(fixture.saves, 1);
});

void test("adding and deleting time spans preserves existing entries and saves", () => {
	const fixture = createTab();
	const list = fixture.tab
		.getSettingDefinitions()
		.find(
			(item) => "type" in item && item.type === "list",
		) as SettingDefinitionList;
	assert.ok(
		list,
		"Time spans must be available to declarative rendering and search",
	);
	assert.equal(list.type, "list");
	assert.equal(list.items?.length, 1);
	list.addItem?.action({} as HTMLElement);
	assert.equal(fixture.plugin.settings.timeSpans.length, 2);
	assert.equal(fixture.plugin.settings.timeSpans[0].number, 2);
	assert.equal(fixture.plugin.settings.timeSpans[1].unit, "month");
	list.onDelete?.(0);
	assert.equal(fixture.plugin.settings.timeSpans.length, 1);
	assert.equal(fixture.plugin.settings.timeSpans[0].unit, "month");
	assert.equal(fixture.saves, 2);
});

void test("quote previews become available when callouts are disabled", async () => {
	const fixture = createTab();
	const group = fixture.tab
		.getSettingDefinitions()
		.find(
			(item) => "heading" in item && item.heading === "Previews",
		) as SettingDefinitionGroup;
	const quote = group.items?.find(
		(item) => item.name === "Use quote element for note previews",
	);
	assert.ok(quote && "visible" in quote);
	assert.equal(typeof quote.visible, "function");
	const visible = quote.visible as () => boolean;
	assert.equal(visible(), false);
	await fixture.tab.setControlValue("useCallout", false);
	assert.equal(visible(), true);
	assert.equal(fixture.plugin.settings.useQuote, true);
});
