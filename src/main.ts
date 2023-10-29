import { Plugin } from "obsidian";

import OnThisDayView from "./view";
import {
	DEFAULT_SETTINGS,
	SETTINGS_UPDATED_EVENT,
	TimeSpan,
	VIEW_TYPE,
} from "./constants";
import { SettingsTab } from "./settingsTab";

export interface Settings {
	timeSpans: TimeSpan[];
	dayMargin: number;
	previewLength: number;
	useHumanize: boolean;
}

export const icon = "calendar-clock";
const label = "Open 'On this day' view";

export default class JournalReviewPlugin extends Plugin {
	settings: Settings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		this.addRibbonIcon(icon, label, () => {
			this.activateView();
		});

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "open-on-this-day",
			name: label,
			callback: () => this.activateView(),
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingsTab(this.app, this));

		this.registerView(
			VIEW_TYPE,
			(leaf) => new OnThisDayView(leaf, this.settings),
		);
	}

	async activateView() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE);

		await this.app.workspace.getRightLeaf(false).setViewState({
			type: VIEW_TYPE,
			active: true,
		});

		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(VIEW_TYPE)[0],
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.app.vault.trigger(SETTINGS_UPDATED_EVENT);
	}
}
