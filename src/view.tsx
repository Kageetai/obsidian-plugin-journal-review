import { debounce, ItemView, moment, TFile, WorkspaceLeaf } from "obsidian";
import {
	appHasDailyNotesPluginLoaded,
	getAllDailyNotes,
	getDateFromFile,
} from "obsidian-daily-notes-interface";
import { render } from "preact";
import Main from "./components/Main";
import AppContext from "./components/context";
import { icon } from "./main";
import { reduceTimeSpans, Settings, VIEW_TYPE } from "./constants";

export default class OnThisDayView extends ItemView {
	private readonly settings: Settings;

	icon = icon;

	constructor(leaf: WorkspaceLeaf, settings: Settings) {
		super(leaf);

		this.settings = settings;

		this.app.workspace.onLayoutReady(() => {
			this.registerEvent(
				this.app.vault.on("create", (file: TFile) => {
					if (getDateFromFile(file, "day")) {
						this.debouncedRenderView();
					}
				}),
			);
			this.registerEvent(
				this.app.vault.on("delete", (file: TFile) => {
					if (getDateFromFile(file, "day")) {
						this.debouncedRenderView();
					}
				}),
			);
			this.registerEvent(
				this.app.vault.on("rename", (file: TFile) => {
					if (getDateFromFile(file, "day")) {
						this.debouncedRenderView();
					}
				}),
			);

			this.registerEvent(
				this.app.workspace.on("file-open", (file) => {
					const dateFromFile = file && getDateFromFile(file, "day");

					if (this.settings.renderOnFileSwitch && dateFromFile) {
						this.debouncedRenderView(dateFromFile);
					}
				}),
			);

			// rerender at midnight
			this.registerInterval(
				window.setInterval(
					() => {
						if (new Date().getHours() === 0) {
							this.renderView();
						}
					},
					60 * 60 * 1000,
				),
			);
		});
	}

	getViewType() {
		return VIEW_TYPE;
	}

	getDisplayText() {
		return "On this day";
	}

	renderView(startDate?: moment.Moment) {
		const container = this.containerEl.children[1];
		const hasDailyNotesPluginLoaded = appHasDailyNotesPluginLoaded();

		if (!hasDailyNotesPluginLoaded) {
			container.createEl("b", {
				text: "Daily notes plugin not loaded",
			});

			return;
		}

		const timeSpans = reduceTimeSpans(
			getAllDailyNotes(),
			this.settings,
			startDate,
		);

		render(
			<AppContext.Provider
				value={{
					app: this.app,
					view: this,
					settings: this.settings,
				}}
			>
				<Main timeSpans={timeSpans} startDate={startDate} />
			</AppContext.Provider>,
			container,
		);
	}

	debouncedRenderView = debounce(this.renderView.bind(this), 500);

	async onOpen() {
		this.debouncedRenderView();
	}

	async onClose() {}
}
