import * as React from "react";
import { getAllDailyNotes, getDailyNote } from "obsidian-daily-notes-interface";
import { moment } from "obsidian";
import { reviewTimeSpans } from "src/constants";

interface Props {
	allDailyNotes: ReturnType<typeof getAllDailyNotes>;
	span: keyof typeof reviewTimeSpans;
	moment: moment.Moment;
}

const TimeSpan = ({ allDailyNotes, span, moment }: Props) => {
	const note = getDailyNote(moment, allDailyNotes);

	if (!note) {
		return null;
	}

	return (
		<div>
			<h4>{span}</h4>
			<ul>
				<li>{note.name}</li>
			</ul>
		</div>
	);
};

export default TimeSpan;
