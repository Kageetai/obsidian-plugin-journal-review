import { ItemView, TFile, WorkspaceLeaf } from "obsidian";
import {
	appHasDailyNotesPluginLoaded,
	getAllDailyNotes,
	getDateFromFile,
} from "obsidian-daily-notes-interface";
import * as React from "preact";
import { render } from "preact";
import Main from "./components/Main";
import AppContext from "./components/context";
import { icon, Settings } from "./main";
import { VIEW_TYPE } from "./constants";

export default class OnThisDayView extends ItemView {
	private root: Element;
	private readonly settings: Settings;

	icon = icon;

	constructor(leaf: WorkspaceLeaf, settings: Settings) {
		super(leaf);

		this.root = this.containerEl.children[1];
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

		render(
			<AppContext.Provider
				value={{
					app: this.app,
					settings: this.settings,
					allDailyNotes,
				}}
			>
				<Main />
			</AppContext.Provider>,
			this.root
		);
	}

	async onOpen() {
		this.renderView();
	}

	async onClose() {}
}
