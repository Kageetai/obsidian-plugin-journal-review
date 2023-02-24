import * as React from "react";
import { getDailyNote } from "obsidian-daily-notes-interface";
import { moment } from "obsidian";

import { reviewTimeSpans } from "src/constants";
import useContext from "src/hooks/useContext";

interface Props {
	span: keyof typeof reviewTimeSpans;
	moment: moment.Moment;
	wrapper?: React.ReactElement;
}

const TimeSpan = ({ span, moment, wrapper }: Props) => {
	const {
		allDailyNotes,
		app: { workspace },
	} = useContext();
	const note = getDailyNote(moment, allDailyNotes);

	if (!note) {
		return null;
	}

	const onClick = () => workspace.getLeaf(false).openFile(note);
	const button = <button onClick={onClick}>{span}</button>;

	if (wrapper) {
		return React.cloneElement(wrapper, {}, button);
	}

	return button;
};

export default TimeSpan;
