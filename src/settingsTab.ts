import { App, debounce, PluginSettingTab, Setting } from "obsidian";
import { DEBOUNCE_DELAY, defaultTimeSpans, Unit } from "./constants";
import JournalReviewPlugin from "./main";

export class SettingsTab extends PluginSettingTab {
	plugin: JournalReviewPlugin;

	constructor(app: App, plugin: JournalReviewPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		containerEl.createEl("h1", { text: "Time Spans" });
		containerEl.createEl("p", {
			text: "Define time spans to review, e.g. '1 month' or 'every 6 months'",
		});
		const container = containerEl.createEl("ul");
		container.addClass("time-spans-container");

		this.plugin.settings.timeSpans.forEach(
			({ number, unit, recurring }, index) => {
				const timeSpanContainer = container.createEl("li");

				new Setting(timeSpanContainer)
					.setName(`${recurring ? "every" : ""} ${number} ${unit}`)
					.addSlider((slider) =>
						slider
							.setValue(number)
							.setLimits(1, 100, 1)
							.setDynamicTooltip()
							.onChange((value) => {
								this.plugin.settings.timeSpans[index].number =
									value;
								this.plugin.saveSettings();
							}),
					)
					.addDropdown((dropdown) =>
						dropdown
							.addOptions(Unit)
							.setValue(unit)
							.onChange((value) => {
								this.plugin.settings.timeSpans[index].unit =
									value as Unit;
								this.plugin.saveSettings();
							}),
					)
					.addToggle((toggle) =>
						toggle
							.setValue(recurring)
							.onChange((value) => {
								this.plugin.settings.timeSpans[
									index
								].recurring = value;
								this.plugin.saveSettings();
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
								this.plugin.saveSettings();
								this.display();
							});
					});
			},
		);

		new Setting(container.createEl("li")).addButton((button) =>
			button.setButtonText("Add Time Span").onClick(() => {
				this.plugin.settings.timeSpans.push(defaultTimeSpans[0]);
				this.display();
			}),
		);

		new Setting(containerEl)
			.setName("Humanize Time Spans")
			.setDesc(
				"Whether to use the 'humanization' feature from moment.js, when rendering the time spans",
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.useHumanize)
					.onChange((value) => {
						this.plugin.settings.useHumanize = value;
						this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Lookup Margin")
			.setDesc(
				"The number of days to include before and after the date being checked",
			)
			.addText((text) =>
				text
					.setValue(this.plugin.settings.dayMargin.toString())
					.onChange(
						debounce((value) => {
							this.plugin.settings.dayMargin = Number(value);
							this.plugin.saveSettings();
						}, DEBOUNCE_DELAY),
					),
			);

		new Setting(containerEl)
			.setName("Preview Length")
			.setDesc("Length of the preview text to show for each note")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.previewLength.toString())
					.onChange(
						debounce((value) => {
							this.plugin.settings.previewLength = Number(value);
							this.plugin.saveSettings();
						}, DEBOUNCE_DELAY),
					),
			);
	}
}
