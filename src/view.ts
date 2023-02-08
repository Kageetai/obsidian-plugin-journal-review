import { ItemView, WorkspaceLeaf } from "obsidian";
import { appHasDailyNotesPluginLoaded } from "obsidian-daily-notes-interface";

export const VIEW_TYPE_EXAMPLE = "example-view";

export default class ExampleView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_EXAMPLE;
	}

	getDisplayText() {
		return "Example view";
	}

	async onOpen() {
		const container = this.containerEl.children[1];
		const hasDailyNotesPluginLoaded = appHasDailyNotesPluginLoaded();

		container.empty();
		container.createEl("h4", {
			text:
				"Example view" +
				(hasDailyNotesPluginLoaded
					? " (with daily notes)"
					: " (without daily notes)"),
		});
	}

	async onClose() {
		// Nothing to clean up.
	}
}
