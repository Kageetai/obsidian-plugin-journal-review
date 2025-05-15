import { moment, Notice, Plugin, WorkspaceLeaf } from "obsidian";
import { getAllDailyNotes } from "obsidian-daily-notes-interface";

import OnThisDayView from "./view";
import {
	DEFAULT_SETTINGS,
	reduceTimeSpans,
	Settings,
	TimeSpan,
	Unit,
	VIEW_TYPE,
} from "./constants";
import { SettingsTab } from "./settingsTab";

export const icon = "calendar-clock";
const label = "Open 'On this day' view";

export default class JournalReviewPlugin extends Plugin {
	settings: Settings;

	checkIsNewDay = () => {
		if (
			!this.settings.date ||
			moment(new Date()).isAfter(this.settings.date, "day")
		) {
			this.settings.date = new Date().toISOString();
			void this.saveSettings();

			const noteCount = reduceTimeSpans(
				getAllDailyNotes(),
				this.settings,
			).reduce((count, timeSpan) => count + timeSpan.notes.length, 0);

			if (noteCount) {
				new Notice(
					`It's a new day! You have ${noteCount} journal entries to review. Open the "On this day" view to see them.`,
					0,
				);
			}
		}
	};

	setupFocusListener = () => {
		if (this.settings.useNotifications) {
			// setup event listener to check if it's a new day and fire notification if so
			// need to wait for notes to be loaded
			setTimeout(this.checkIsNewDay, 1000);
			addEventListener("focus", this.checkIsNewDay);
		} else {
			removeEventListener("focus", this.checkIsNewDay);
		}
	};

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		this.addRibbonIcon(icon, label, () => {
			void this.activateView();
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

		this.setupFocusListener();
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE);

		if (leaves.length > 0) {
			// A leaf with our view already exists, use that
			leaf = leaves[0];
		} else {
			// Our view could not be found in the workspace, create a new leaf
			// in the right sidebar for it
			leaf = workspace.getRightLeaf(false);
			await leaf?.setViewState({ type: VIEW_TYPE, active: true });
		}

		// "Reveal" the leaf in case it is in a collapsed sidebar
		await workspace.revealLeaf(leaf!);

		this.renderView();
	}

	onunload() {
		removeEventListener("focus", this.checkIsNewDay);
	}

	async loadSettings() {
		// the settings could be in an outdated format
		const loadedData = (await this.loadData()) as Settings & {
			timeSpans: [number, string][];
		};
		const parsedData: Settings = loadedData;

		// check if v1 settings are loaded and convert them to v2
		if (
			loadedData?.timeSpans?.length &&
			Object.prototype.hasOwnProperty.call(loadedData.timeSpans[0], "length")
		) {
			parsedData.timeSpans = loadedData.timeSpans.map(
				([number, unit]: [number, string]) => ({
					number,
					unit: (unit.endsWith("s") ? unit.slice(0, -1) : unit) as Unit,
					recurring: false,
				}),
			) as TimeSpan[];
		}

		this.settings = Object.assign({}, DEFAULT_SETTINGS, parsedData);
	}

	renderView() {
		const leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE).first();

		if (leaf && leaf.view instanceof OnThisDayView) {
			leaf.view.renderView();
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.renderView();
		this.setupFocusListener();
	}
}
