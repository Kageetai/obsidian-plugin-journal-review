import { App, debounce, PluginSettingTab, Setting } from "obsidian";
import {
	DEBOUNCE_DELAY,
	defaultTimeSpans,
	getTimeSpanTitle,
	Unit,
} from "./constants";
import JournalReviewPlugin from "./main";

const getMaxTimeSpan = (unit: Unit) => {
	switch (unit) {
		case Unit.day:
			return 31;
		case Unit.week:
			return 52;
		case Unit.month:
			return 24;
		case Unit.year:
			return 100;
	}
};

export class SettingsTab extends PluginSettingTab {
	plugin: JournalReviewPlugin;

	constructor(app: App, plugin: JournalReviewPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		containerEl.createEl("h1", { text: "Journal Review" });
		containerEl.createEl("h2", { text: "Time Spans" });
		containerEl.createEl("p", {
			cls: "setting-item-description",
			text: "Define time spans to review, e.g. '1 month' or 'every 6 months'",
		});
		const container = containerEl.createEl("ul");
		container.addClass("time-spans-container");

		this.plugin.settings.timeSpans.forEach(
			({ number, unit, recurring }, index) => {
				const timeSpanContainer = container.createEl("li");

				new Setting(timeSpanContainer)
					.setName(`Time span #${index + 1}`)
					.setDesc(getTimeSpanTitle({ number, unit, recurring }))
					.addSlider((slider) =>
						slider
							.setValue(number)
							.setLimits(1, getMaxTimeSpan(unit), 1)
							.setDynamicTooltip()
							.onChange(
								debounce(
									(value) => {
										this.plugin.settings.timeSpans[index].number = value;
										void this.plugin.saveSettings();
										this.display();
									},
									DEBOUNCE_DELAY,
									true,
								),
							),
					)
					.addDropdown((dropdown) =>
						dropdown
							.addOptions(Unit)
							.setValue(unit)
							.onChange((value) => {
								this.plugin.settings.timeSpans[index].unit = value as Unit;
								void this.plugin.saveSettings();
								this.display();
							}),
					)
					.addToggle((toggle) =>
						toggle
							.setValue(Boolean(recurring))
							.onChange((value) => {
								this.plugin.settings.timeSpans[index].recurring = value;
								void this.plugin.saveSettings();
								this.display();
							})
							.setTooltip("Recurring?"),
					)
					.addButton((button) => {
						button
							.setButtonText("X")
							.setIcon("delete")
							.setTooltip("Delete")
							.onClick(() => {
								this.plugin.settings.timeSpans.splice(index, 1);
								void this.plugin.saveSettings();
								this.display();
							});
					});
			},
		);

		new Setting(container.createEl("li")).addButton((button) =>
			button
				.setCta()
				.setButtonText("Add Time Span")
				.onClick(() => {
					this.plugin.settings.timeSpans.push({
						...defaultTimeSpans[0],
					});
					void this.plugin.saveSettings();
					this.display();
				}),
		);

		new Setting(containerEl)
			.setName("Show Note Title with previews")
			.setDesc(
				"Render the note title above the preview text, when showing note previews.",
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showNoteTitle)
					.onChange((value) => {
						this.plugin.settings.showNoteTitle = value;
						void this.plugin.saveSettings();
					}),
			);

		const humanizeDescription = new DocumentFragment();
		humanizeDescription.textContent =
			"Use the 'humanization' feature from moment.js, when rendering the time spans titles. ";
		humanizeDescription.createEl("a", {
			text: "More info",
			attr: {
				href: "https://momentjs.com/docs/#/durations/humanize/",
			},
		});

		new Setting(containerEl)
			.setName("Humanize Time Spans")
			.setDesc(humanizeDescription)
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.useHumanize).onChange((value) => {
					this.plugin.settings.useHumanize = value;
					void this.plugin.saveSettings();
				}),
			);

		const calloutsDescription = new DocumentFragment();
		calloutsDescription.textContent =
			"Use callouts to render note previews, using their styles based on current theme. ";
		calloutsDescription.createEl("a", {
			text: "More info",
			attr: {
				href: "https://help.obsidian.md/Editing+and+formatting/Callouts",
			},
		});

		new Setting(containerEl)
			.setName("Use Obsidian callouts for note previews")
			.setDesc(calloutsDescription)
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.useCallout).onChange((value) => {
					this.plugin.settings.useCallout = value;
					void this.plugin.saveSettings();
					this.display();
				}),
			);

		if (!this.plugin.settings.useCallout) {
			new Setting(containerEl)
				.setName("Use quote element for note previews")
				.setDesc("Format note previews using the HTML quote element")
				.addToggle((toggle) =>
					toggle.setValue(this.plugin.settings.useQuote).onChange((value) => {
						this.plugin.settings.useQuote = value;
						void this.plugin.saveSettings();
					}),
				);
		}

		new Setting(containerEl)
			.setName("Lookup Margin")
			.setDesc(
				"The number of days to include before and after the date being checked",
			)
			.addSlider((slider) => {
				slider
					.setValue(this.plugin.settings.dayMargin)
					.setDynamicTooltip()
					.onChange((value) => {
						this.plugin.settings.dayMargin = value;
						void this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Preview Length")
			.setDesc("Length of the preview text to show for each note")
			.addSlider((slider) => {
				slider
					.setValue(this.plugin.settings.previewLength)
					.setDynamicTooltip()
					.setLimits(0, 1000, 10)
					.onChange((value) => {
						this.plugin.settings.previewLength = value;
						void this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Open in new pane")
			.setDesc("Open the notes in a new pane/tab by default")
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.openInNewPane)
					.onChange((value) => {
						this.plugin.settings.openInNewPane = value;
						void this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Use notifications")
			.setDesc(
				"Use notifications (inside Obsidian) to let you know, when there are new journal entries to review. This will happen when Obsidian is focused and it's a new day.",
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.useNotifications)
					.onChange((value) => {
						this.plugin.settings.useNotifications = value;
						void this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Date based on selected note")
			.setDesc("Use the date of the currently open daily note.")
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.renderOnFileSwitch)
					.onChange((value) => {
						this.plugin.settings.renderOnFileSwitch = value;
						void this.plugin.saveSettings();
					});
			});
	}
}
