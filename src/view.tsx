import { ItemView, WorkspaceLeaf } from "obsidian";
import {
	appHasDailyNotesPluginLoaded,
	getAllDailyNotes,
	getDailyNote,
} from "obsidian-daily-notes-interface";
import { createRoot } from "react-dom/client";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { reviewTimeSpans } from "./constants";
import Main from "./components/Main";

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

		const root = createRoot(container);
		root.render(
			<React.StrictMode>
				<Main dailyNotes={allDailyNotes} />
			</React.StrictMode>
		);
	}

	async onClose() {
		ReactDOM.unmountComponentAtNode(this.containerEl.children[1]);
	}
}
