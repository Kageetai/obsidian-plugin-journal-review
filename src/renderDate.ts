import type { moment } from "obsidian";

export const getDailyNoteRenderDate = (
	dateFromFile: moment.Moment | null,
	renderOnFileSwitch: boolean,
) => {
	if (!dateFromFile) {
		return null;
	}

	return renderOnFileSwitch ? dateFromFile : undefined;
};
