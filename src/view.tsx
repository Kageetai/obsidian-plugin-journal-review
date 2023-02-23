import { ItemView, WorkspaceLeaf } from "obsidian";
import {
	appHasDailyNotesPluginLoaded,
	getAllDailyNotes,
} from "obsidian-daily-notes-interface";
import { createRoot, Root } from "react-dom/client";
import * as React from "react";
import Main from "./components/Main";
import AppContext from "./components/context";

export const VIEW_TYPE = "on-this-day-view";

export default class OnThisDayView extends ItemView {
	private root: Root;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);

		this.root = createRoot(this.containerEl.children[1]);
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

		this.root.render(
			<React.StrictMode>
				<AppContext.Provider value={{ app: this.app, allDailyNotes }}>
					<Main />
				</AppContext.Provider>
			</React.StrictMode>
		);
	}

	async onClose() {
		this.root.unmount();
	}
}
