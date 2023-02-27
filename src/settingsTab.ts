import { App, debounce, Notice, PluginSettingTab, Setting } from "obsidian";
import { DEBOUNCE_DELAY, Unit } from "./constants";
import JournalReviewPlugin from "./main";

export class SettingsTab extends PluginSettingTab {
	plugin: JournalReviewPlugin;

	constructor(app: App, plugin: JournalReviewPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	parseSettingsInput(t: string) {
		console.log("parseSettingsInput", t);
		const [number, unit] = t.split(" ").filter((t) => !!t);

		if (!Object.values(Unit).includes(unit as Unit)) {
			const message = `Invalid unit "${unit}" in time span`;
			new Notice(message);
			throw new Error(message);
		}

		return [Number(number), unit as Unit] as [number, Unit];
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
							.filter(Boolean)
							.map((t) => `${Math.abs(t[0])} ${t[1]}`)
							.join("\n")
					)
					.onChange(
						debounce((value) => {
							this.plugin.settings.timeSpans = value
								.split("\n")
								.filter(Boolean)
								.map(this.parseSettingsInput);
							this.plugin.saveSettings();
						}, DEBOUNCE_DELAY)
					)
			);

		new Setting(containerEl)
			.setName("Day Margin")
			.setDesc(
				"The number of days to include before and after the date being checked"
			)
			.addText((text) =>
				text
					.setValue(this.plugin.settings.dayMargin.toString())
					.onChange(
						debounce((value: string | number) => {
							this.plugin.settings.dayMargin = Number(value);
							this.plugin.saveSettings();
						}, DEBOUNCE_DELAY)
					)
			);
	}
}
