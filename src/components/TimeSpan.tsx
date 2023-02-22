import * as React from "react";
import { getDailyNote } from "obsidian-daily-notes-interface";
import { moment } from "obsidian";

import { reviewTimeSpans } from "src/constants";
import useApp from "src/hooks/useApp";
import useAllDailyNotes from "src/hooks/useAllDailyNotes";

interface Props {
	span: keyof typeof reviewTimeSpans;
	moment: moment.Moment;
}

const TimeSpan = ({ span, moment }: Props) => {
	const allDailyNotes = useAllDailyNotes();
	const { workspace } = useApp();
	const note = getDailyNote(moment, allDailyNotes);

	if (!note) {
		return null;
	}

	const onClick = async () => {
		await workspace.getLeaf(false).openFile(note);
	};

	return (
		<div>
			<h4>{span}</h4>
			<ul>
				<li onClick={onClick}>{note.name}</li>
			</ul>
		</div>
	);
};

export default TimeSpan;
