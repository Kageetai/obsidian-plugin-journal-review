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
			.setName("Humanize Time Spans")
			.setDesc(
				"Whether to use the 'humanization' feature from moment.js, when rendering the time spans",
			)
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.useHumanize).onChange((value) => {
					this.plugin.settings.useHumanize = value;
					void this.plugin.saveSettings();
				}),
			);

		new Setting(containerEl)
			.setName("Use Obsidian callouts for note previews")
			.setDesc(
				"Use callouts to render note previews, using their styles based on current theme. More info: https://help.obsidian.md/Editing+and+formatting/Callouts",
			)
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.useCallout).onChange((value) => {
					this.plugin.settings.useCallout = value;
					void this.plugin.saveSettings();
				}),
			);

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
			.setDesc("Open the notes in a new pane/tab")
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.openInNewPane)
					.onChange((value) => {
						this.plugin.settings.openInNewPane = value;
						void this.plugin.saveSettings();
					});
			});
	}
}
