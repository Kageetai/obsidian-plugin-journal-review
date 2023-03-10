import * as React from "preact";
import { getDailyNote } from "obsidian-daily-notes-interface";
import { moment } from "obsidian";
import useContext from "src/hooks/useContext";
import NotePreview from "./NotePreview";

interface Props {
	title: string;
	moment: moment.Moment;
	wrapper?: React.JSX.Element;
}

const TimeSpan = ({ title, moment: mom, wrapper }: Props) => {
	const {
		allDailyNotes,
		settings: { dayMargin },
	} = useContext();

	const notes = Array(dayMargin * 2 + 1)
		.fill(0)
		.map((_, i) =>
			getDailyNote(moment(mom).add(i - dayMargin, "days"), allDailyNotes)
		)
		.filter(Boolean);

	if (!notes.length) {
		return null;
	}

	const component = (
		<>
			<h3>
				{title}
				{dayMargin ? <small> (+/- {dayMargin} days)</small> : ""}:
			</h3>

			<ul className="list">
				{notes.map((note) => (
					<li key={note.name}>
						<NotePreview note={note} />
					</li>
				))}
			</ul>
		</>
	);

	if (wrapper) {
		return React.cloneElement(wrapper, {}, component);
	}

	return component;
};

export default TimeSpan;
