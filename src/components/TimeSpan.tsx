import * as React from "react";
import { getAllDailyNotes, getDailyNote } from "obsidian-daily-notes-interface";
import { moment } from "obsidian";

import { reviewTimeSpans } from "src/constants";
import useApp from "src/hooks/useApp";

interface Props {
	allDailyNotes: ReturnType<typeof getAllDailyNotes>;
	span: keyof typeof reviewTimeSpans;
	moment: moment.Moment;
}

const TimeSpan = ({ allDailyNotes, span, moment }: Props) => {
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
