import { App, PluginSettingTab, Setting } from "obsidian";
import { Unit } from "./constants";
import JournalReviewPlugin from "./main";

export class SettingsTab extends PluginSettingTab {
	plugin: JournalReviewPlugin;

	constructor(app: App, plugin: JournalReviewPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	parseSettingsInput(t: string) {
		const [number, unit] = t.split(" ").filter((t) => !!t);

		if (!Object.values(Unit).includes(unit as Unit)) {
			throw new Error(`Invalid unit '${unit}' in time span`);
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
							.map((t) => `${Math.abs(t[0])} ${t[1]}`)
							.join("\n")
					)
					.onChange(async (value) => {
						this.plugin.settings.timeSpans = value
							.split("\n")
							.map(this.parseSettingsInput);
						await this.plugin.saveSettings();
					})
			);
	}
}
