import { ItemView, TFile, WorkspaceLeaf } from "obsidian";
import {
	appHasDailyNotesPluginLoaded,
	getAllDailyNotes,
	getDateFromFile,
} from "obsidian-daily-notes-interface";
import { createRoot, Root } from "react-dom/client";
import * as React from "react";
import Main from "./components/Main";
import AppContext from "./components/context";
import { icon, Settings } from "./main";
import { VIEW_TYPE } from "./constants";

export default class OnThisDayView extends ItemView {
	private root: Root;
	private readonly settings: Settings;

	icon = icon;

	constructor(leaf: WorkspaceLeaf, settings: Settings) {
		super(leaf);

		this.root = createRoot(this.containerEl.children[1]);
		this.settings = settings;

		this.registerEvent(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(this.app.workspace as any).on(
				"journal-review:settings-updated",
				() => this.renderView()
			)
		);
		this.registerEvent(
			this.app.workspace.on("file-open", (file: TFile) => {
				if (getDateFromFile(file, "day")) {
					this.renderView();
				}
			})
		);
	}

	getViewType() {
		return VIEW_TYPE;
	}

	getDisplayText() {
		return "On this day";
	}

	renderView() {
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
				<AppContext.Provider
					value={{
						app: this.app,
						settings: this.settings,
						allDailyNotes,
					}}
				>
					<Main />
				</AppContext.Provider>
			</React.StrictMode>
		);
	}

	async onOpen() {
		this.renderView();
	}

	async onClose() {
		this.root.unmount();
	}
}
