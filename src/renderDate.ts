import type { moment } from "obsidian";

export const getDailyNoteRenderDate = (
	dateFromFile: moment.Moment | null,
	activeFileDate: moment.Moment | null,
	renderOnFileSwitch: boolean,
) => {
	if (!dateFromFile) {
		return null;
	}

	return renderOnFileSwitch ? activeFileDate || undefined : undefined;
};

export const getRenamedDailyNoteDate = (
	newPathDate: moment.Moment | null,
	oldPathDate: moment.Moment | null,
) => newPathDate || oldPathDate;
