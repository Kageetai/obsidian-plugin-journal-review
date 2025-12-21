import { App, debounce, PluginSettingTab, SettingGroup } from "obsidian";
import {
	DEBOUNCE_DELAY,
	defaultTimeSpans,
	getTimeSpanTitle,
	RandomNotePosition,
	SortOrder,
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
		containerEl.addClass("journal-review-settings");

		// Time Spans section - uses custom structure for dynamic list
		const timeSpansGroup = new SettingGroup(containerEl)
			.setHeading("Time Spans")
			.addClass("time-spans-group");

		// Add description and dynamic time spans via addSetting
		timeSpansGroup.addSetting((setting) => {
			setting.setDesc(
				"Define time spans to review, e.g. '1 month' or 'every 6 months'. Overlapping time spans may cause duplicate entries.",
			);
			setting.settingEl.addClass("time-spans-description");
		});

		this.plugin.settings.timeSpans.forEach(
			({ number, unit, recurring }, index) => {
				timeSpansGroup.addSetting((setting) => {
					setting
						.setName(`Time span #${index + 1}`)
						.setDesc(getTimeSpanTitle({ number, unit, recurring }))
						.addSlider((slider) =>
							slider
								.setLimits(1, getMaxTimeSpan(unit), 1)
								.setDynamicTooltip()
								.setValue(number)
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
						.addButton((button) =>
							button
								.setButtonText("X")
								.setIcon("delete")
								.setTooltip("Delete")
								.onClick(() => {
									this.plugin.settings.timeSpans.splice(index, 1);
									void this.plugin.saveSettings();
									this.display();
								}),
						);
				});
			},
		);

		timeSpansGroup.addSetting((setting) => {
			setting.addButton((button) =>
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
		});

		// General settings (related to time span lookup)
		new SettingGroup(containerEl)
			.setHeading("General")
			.addSetting((setting) => {
				setting
					.setName("Lookup Margin")
					.setDesc(
						"The number of days to include before and after the date being checked",
					)
					.addSlider((slider) =>
						slider
							.setDynamicTooltip()
							.setValue(this.plugin.settings.dayMargin)
							.onChange(
								debounce(
									(value) => {
										this.plugin.settings.dayMargin = value;
										void this.plugin.saveSettings();
									},
									DEBOUNCE_DELAY,
									true,
								),
							),
					);
			})
			.addSetting((setting) => {
				setting
					.setName("Sort Order")
					.setDesc(
						"Order time spans and notes either by oldest or newest first.",
					)
					.addDropdown((dropdown) => {
						dropdown
							.addOptions({ asc: "Oldest first", desc: "Newest first" })
							.setValue(this.plugin.settings.sortOrder)
							.onChange((value: SortOrder) => {
								this.plugin.settings.sortOrder = value;
								void this.plugin.saveSettings();
							});
					});
			})
			.addSetting((setting) => {
				setting
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
			});

		// Random Daily Note section
		new SettingGroup(containerEl)
			.setHeading("Random Daily Note")
			.addSetting((setting) => {
				setting
					.setName("Show Random Daily Note")
					.setDesc("Show a random daily note besides the other notes.")
					.addToggle((toggle) =>
						toggle
							.setValue(this.plugin.settings.showRandomNote)
							.onChange((value) => {
								this.plugin.settings.showRandomNote = value;
								void this.plugin.saveSettings();
							}),
					);
			})
			.addSetting((setting) => {
				setting
					.setName("Random Note Position")
					.setDesc("Whether to show the random daily note on top or bottom.")
					.addDropdown((dropdown) =>
						dropdown
							.addOptions({ top: "Top", bottom: "Bottom" })
							.setValue(this.plugin.settings.randomNotePosition)
							.onChange((value: RandomNotePosition) => {
								this.plugin.settings.randomNotePosition = value;
								void this.plugin.saveSettings();
							}),
					);
			});

		// Previews section
		const previewsGroup = new SettingGroup(containerEl)
			.setHeading("Previews")
			.addSetting((setting) => {
				setting
					.setName("Preview Length")
					.setDesc("Length of the preview text to show for each note.")
					.addSlider((slider) =>
						slider
							.setLimits(0, 1000, 10)
							.setDynamicTooltip()
							.setValue(this.plugin.settings.previewLength)
							.onChange(
								debounce(
									(value) => {
										this.plugin.settings.previewLength = value;
										void this.plugin.saveSettings();
									},
									DEBOUNCE_DELAY,
									true,
								),
							),
					);
			})
			.addSetting((setting) => {
				setting
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
			})
			.addSetting((setting) => {
				const humanizeDescription = new DocumentFragment();
				humanizeDescription.textContent =
					"Use the 'humanization' feature from moment.js, when rendering the time spans titles. ";
				humanizeDescription.createEl("a", {
					text: "More info",
					attr: {
						href: "https://momentjs.com/docs/#/durations/humanize/",
					},
				});

				setting
					.setName("Humanize Time Spans")
					.setDesc(humanizeDescription)
					.addToggle((toggle) =>
						toggle
							.setValue(this.plugin.settings.useHumanize)
							.onChange((value) => {
								this.plugin.settings.useHumanize = value;
								void this.plugin.saveSettings();
							}),
					);
			})
			.addSetting((setting) => {
				const calloutsDescription = new DocumentFragment();
				calloutsDescription.textContent =
					"Use callouts to render note previews, using their styles based on current theme. ";
				calloutsDescription.createEl("a", {
					text: "More info",
					attr: {
						href: "https://help.obsidian.md/Editing+and+formatting/Callouts",
					},
				});

				setting
					.setName("Use Obsidian callouts for note previews")
					.setDesc(calloutsDescription)
					.addToggle((toggle) =>
						toggle
							.setValue(this.plugin.settings.useCallout)
							.onChange((value) => {
								this.plugin.settings.useCallout = value;
								void this.plugin.saveSettings();
								this.display();
							}),
					);
			});

		if (!this.plugin.settings.useCallout) {
			previewsGroup.addSetting((setting) => {
				setting
					.setName("Use quote element for note previews")
					.setDesc("Format note previews using the HTML quote element")
					.addToggle((toggle) =>
						toggle.setValue(this.plugin.settings.useQuote).onChange((value) => {
							this.plugin.settings.useQuote = value;
							void this.plugin.saveSettings();
						}),
					);
			});
		}

		previewsGroup.addSetting((setting) => {
			setting
				.setName("Open in new pane")
				.setDesc(
					"Open the notes in a new pane/tab by default when clicking them.",
				)
				.addToggle((toggle) =>
					toggle
						.setValue(this.plugin.settings.openInNewPane)
						.onChange((value) => {
							this.plugin.settings.openInNewPane = value;
							void this.plugin.saveSettings();
						}),
				);
		});

		// Other section
		new SettingGroup(containerEl)
			.setHeading("Other")
			.addSetting((setting) => {
				setting
					.setName("Use notifications")
					.setDesc(
						"Use notifications (inside Obsidian) to let you know, when there are new journal entries to review. This will happen when Obsidian is focused and it's a new day.",
					)
					.addToggle((toggle) =>
						toggle
							.setValue(this.plugin.settings.useNotifications)
							.onChange((value) => {
								this.plugin.settings.useNotifications = value;
								void this.plugin.saveSettings();
							}),
					);
			})
			.addSetting((setting) => {
				setting
					.setName("Note filtering regex")
					.setDesc(
						"Use any string or regex (without `/` at beginning and end or flags) to filter the note content before rendering.",
					)
					.addText((text) =>
						text
							.setValue(this.plugin.settings.noteMarkdownRegex)
							.onChange((value) => {
								this.plugin.settings.noteMarkdownRegex = value;
								void this.plugin.saveSettings();
							}),
					);
			});
	}
}
