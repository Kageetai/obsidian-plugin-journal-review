import { ItemView, WorkspaceLeaf } from "obsidian";
import {
	appHasDailyNotesPluginLoaded,
	getAllDailyNotes,
	getDailyNote,
} from "obsidian-daily-notes-interface";
import { reviewTimeSpans } from "./constants";

export const VIEW_TYPE = "on-this-day-view";

export default class OnThisDayView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE;
	}

	getDisplayText() {
		return "On this day";
	}

	async onOpen() {
		const container = this.containerEl.children[1];
		const hasDailyNotesPluginLoaded = appHasDailyNotesPluginLoaded();

		if (!hasDailyNotesPluginLoaded) {
			container.createEl("b", {
				text: "Daily notes plugin not loaded",
			});

			return;
		}

		const allDailyNotes = getAllDailyNotes();
		console.log("allDailyNotes", allDailyNotes);

		for (const [key, value] of Object.entries(reviewTimeSpans)) {
			console.log(`${key}: ${value}`);
			console.log(getDailyNote(value, allDailyNotes));
		}

		container.empty();
		container.createEl("h4", {
			text: "On this day:",
		});
	}

	async onClose() {
		// Nothing to clean up.
	}
}
