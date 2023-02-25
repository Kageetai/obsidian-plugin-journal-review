import { App, Plugin, PluginSettingTab, Setting } from "obsidian";

import OnThisDayView, { VIEW_TYPE } from "./view";
import { timeSpans, Unit } from "./constants";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
	timeSpans: typeof timeSpans;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
	timeSpans,
};

export const icon = "calendar-clock";

export default class JournalReviewPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		this.addRibbonIcon(icon, "Activate view", () => {
			this.activateView();
		});

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText("Status Bar Text");

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "open-on-this-day",
			name: "Open 'On this day' view",
			callback: () => {
				// new SampleModal(this.app).open();
				this.activateView();
			},
		});
		// This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: "sample-editor-command",
		// 	name: "Sample editor command",
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection("Sample Editor Command");
		// 	},
		// });
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: "open-sample-modal-complex",
		// 	name: "Open sample modal (complex)",
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView =
		// 			this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}
		//
		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	},
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, "click", (evt: MouseEvent) => {
		// 	console.log("click", evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(
		// 	window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		// );

		this.registerView(VIEW_TYPE, (leaf) => new OnThisDayView(leaf));
	}

	async activateView() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE);

		await this.app.workspace.getRightLeaf(false).setViewState({
			type: VIEW_TYPE,
			active: true,
		});

		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

// class SampleModal extends Modal {
// 	constructor(app: App) {
// 		super(app);
// 	}
//
// 	onOpen() {
// 		const { contentEl } = this;
// 		contentEl.setText("Woah!");
// 	}
//
// 	onClose() {
// 		const { contentEl } = this;
// 		contentEl.empty();
// 	}
// }

class SampleSettingTab extends PluginSettingTab {
	plugin: JournalReviewPlugin;

	constructor(app: App, plugin: JournalReviewPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("TimeSpans")
			.setDesc(
				'Time spans to review, one per line, in the format "number unit", with unit being one of "day", "week", "month" or "year"'
			)
			.addTextArea((text) =>
				text
					.setValue(
						this.plugin.settings.timeSpans
							.map((t) => `${Math.abs(t[0])} ${t[1]}`)
							.join("\n")
					)
					.onChange(async (value) => {
						this.plugin.settings.timeSpans = value
							.split("\n")
							.map((t) => {
								const [number, unit] = t
									.split(" ")
									.filter((t) => !!t);

								if (
									!Object.values(Unit).includes(unit as Unit)
								) {
									throw new Error(
										`Invalid unit '${unit}' in time span`
									);
								}

								return [Number(number), unit as Unit];
							});
						await this.plugin.saveSettings();
					})
			);
	}
}
