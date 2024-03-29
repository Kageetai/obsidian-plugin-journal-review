import * as React from "preact";
import { TFile } from "obsidian";
import useContext from "../hooks/useContext";
import NotePreview from "./NotePreview";

interface Props {
	title: string;
	notes: TFile[];
	wrapper?: React.JSX.Element;
}

const TimeSpan = ({ title, notes, wrapper }: Props) => {
	const {
		settings: { dayMargin },
	} = useContext();

	if (!notes.length) {
		return null;
	}

	const component = (
		<>
			<h3>
				{title}
				{dayMargin ? <small> (+/- {dayMargin} day(s))</small> : ""}:
			</h3>

			<ul className="list notes">
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
