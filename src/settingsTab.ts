import {
	App,
	debounce,
	PluginSettingTab,
	type SettingDefinitionItem,
} from "obsidian";
import {
	DEBOUNCE_DELAY,
	defaultTimeSpans,
	getTimeSpanTitle,
	type Settings,
	Unit,
} from "./constants";
import type JournalReviewPlugin from "./main";

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

	async setControlValue(key: keyof Settings, value: unknown): Promise<void> {
		Object.assign(this.plugin.settings, { [key]: value });
		await this.plugin.saveSettings();
		this.refreshDomState();
	}

	getSettingDefinitions(): SettingDefinitionItem<keyof Settings>[] {
		const humanizeDescription = new DocumentFragment();
		humanizeDescription.textContent =
			"Use the 'humanization' feature from moment.js, when rendering the time spans titles. ";
		humanizeDescription.createEl("a", {
			text: "More info",
			attr: { href: "https://momentjs.com/docs/#/durations/humanize/" },
		});
		const calloutsDescription = new DocumentFragment();
		calloutsDescription.textContent =
			"Use callouts to render note previews, using their styles based on current theme. ";
		calloutsDescription.createEl("a", {
			text: "More info",
			attr: {
				href: "https://help.obsidian.md/Editing+and+formatting/Callouts",
			},
		});

		return [
			{
				name: "",
				desc: "Define time spans to review, e.g. '1 month' or 'every 6 months'. Overlapping time spans may cause duplicate entries.",
				searchable: false,
			},
			{
				type: "list",
				heading: "Time Spans",
				cls: "time-spans-group",
				items: this.plugin.settings.timeSpans.map((span, index) => ({
					name: `Time span #${index + 1}`,
					desc: getTimeSpanTitle(span),
					render: (setting) => {
						const debouncedSave = debounce(
							(value: number) => {
								span.number = value;
								void this.plugin.saveSettings();
							},
							DEBOUNCE_DELAY,
							true,
						);
						setting
							.addSlider((slider) =>
								slider
									.setLimits(1, getMaxTimeSpan(span.unit), 1)
									.setValue(span.number)
									.onChange((value) => {
										setting.setDesc(
											getTimeSpanTitle({ ...span, number: value }),
										);
										debouncedSave(value);
									}),
							)
							.addDropdown((dropdown) =>
								dropdown
									.addOptions(Unit)
									.setValue(span.unit)
									.onChange((value) => {
										span.unit = value as Unit;
										void this.plugin.saveSettings();
										this.update();
									}),
							)
							.addToggle((toggle) =>
								toggle
									.setValue(Boolean(span.recurring))
									.onChange((value) => {
										span.recurring = value;
										void this.plugin.saveSettings();
										this.update();
									})
									.setTooltip("Recurring?"),
							);
					},
				})),
				onDelete: (index) => {
					this.plugin.settings.timeSpans.splice(index, 1);
					void this.plugin.saveSettings();
					this.update();
				},
				addItem: {
					name: "Add time span",
					action: () => {
						this.plugin.settings.timeSpans.push({ ...defaultTimeSpans[0] });
						void this.plugin.saveSettings();
						this.update();
					},
				},
				emptyState: "No time spans configured.",
			},
			{
				type: "group",
				heading: "General",
				items: [
					{
						name: "Lookup margin",
						desc: "The number of days to include before and after the date being checked",
						render: (setting) => {
							setting.addSlider((slider) =>
								slider.setValue(this.plugin.settings.dayMargin).onChange(
									debounce(
										(value: number) => {
											this.plugin.settings.dayMargin = value;
											void this.plugin.saveSettings();
										},
										DEBOUNCE_DELAY,
										true,
									),
								),
							);
						},
					},
					{
						name: "Sort order",
						desc: "Order time spans and notes either by oldest or newest first.",
						control: {
							type: "dropdown",
							key: "sortOrder",
							options: { asc: "Oldest first", desc: "Newest first" },
						},
					},
					{
						name: "Date based on selected note",
						desc: "Use the date of the currently open daily note.",
						control: { type: "toggle", key: "renderOnFileSwitch" },
					},
				],
			},
			{
				type: "group",
				heading: "Random Daily Note",
				items: [
					{
						name: "Show random daily note",
						desc: "Show a random daily note besides the other notes.",
						control: { type: "toggle", key: "showRandomNote" },
					},
					{
						name: "Random note position",
						desc: "Whether to show the random daily note on top or bottom.",
						control: {
							type: "dropdown",
							key: "randomNotePosition",
							options: { top: "Top", bottom: "Bottom" },
						},
					},
				],
			},
			{
				type: "group",
				heading: "Previews",
				items: [
					{
						name: "Preview length",
						desc: "Length of the preview text to show for each note.",
						render: (setting) => {
							setting.addSlider((slider) =>
								slider
									.setLimits(0, 1000, 10)
									.setValue(this.plugin.settings.previewLength)
									.onChange(
										debounce(
											(value: number) => {
												this.plugin.settings.previewLength = value;
												void this.plugin.saveSettings();
											},
											DEBOUNCE_DELAY,
											true,
										),
									),
							);
						},
					},
					{
						name: "Show note title with previews",
						desc: "Render the note title above the preview text, when showing note previews.",
						control: { type: "toggle", key: "showNoteTitle" },
					},
					{
						name: "Use YAML title",
						desc: "Use the note’s YAML title property when available. Otherwise, show the file name.",
						control: { type: "toggle", key: "useFrontmatterTitle" },
					},
					{
						name: "Humanize time spans",
						desc: humanizeDescription,
						control: { type: "toggle", key: "useHumanize" },
					},
					{
						name: "Use Obsidian callouts for note previews",
						desc: calloutsDescription,
						control: { type: "toggle", key: "useCallout" },
					},
					{
						name: "Use quote element for note previews",
						desc: "Format note previews using the HTML quote element",
						visible: () => !this.plugin.settings.useCallout,
						control: { type: "toggle", key: "useQuote" },
					},
					{
						name: "Open in new pane",
						desc: "Open the notes in a new pane/tab by default when clicking them.",
						control: { type: "toggle", key: "openInNewPane" },
					},
				],
			},
			{
				type: "group",
				heading: "Other",
				items: [
					{
						name: "Use notifications",
						desc: "Use notifications (inside Obsidian) to let you know, when there are new journal entries to review. This will happen when Obsidian is focused and it's a new day.",
						control: { type: "toggle", key: "useNotifications" },
					},
					{
						name: "Note filtering regex",
						desc: "Use any string or regex (without `/` at beginning and end or flags) to filter the note content before rendering.",
						control: { type: "text", key: "noteMarkdownRegex" },
					},
				],
			},
		];
	}
}
