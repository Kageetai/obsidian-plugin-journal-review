import { ItemView, WorkspaceLeaf } from "obsidian";
import {
	appHasDailyNotesPluginLoaded,
	getAllDailyNotes,
} from "obsidian-daily-notes-interface";
import { createRoot } from "react-dom/client";
import * as React from "react";
import * as ReactDOM from "react-dom";
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

		const root = createRoot(container);
		root.render(
			<React.StrictMode>
				<Main allDailyNotes={allDailyNotes} />
			</React.StrictMode>
		);
	}

	async onClose() {
		ReactDOM.unmountComponentAtNode(this.containerEl.children[1]);
	}
}
