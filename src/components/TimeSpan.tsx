import * as React from "react";
import { getDailyNote } from "obsidian-daily-notes-interface";
import { moment } from "obsidian";
import useContext from "src/hooks/useContext";

interface Props {
	title: string;
	moment: moment.Moment;
	wrapper?: React.ReactElement;
}

const TimeSpan = ({ title, moment, wrapper }: Props) => {
	const {
		allDailyNotes,
		app: { workspace },
	} = useContext();
	const note = getDailyNote(moment, allDailyNotes);

	if (!note) {
		return null;
	}

	const onClick = () => workspace.getLeaf(false).openFile(note);
	const component = (
		<button onClick={onClick}>
			<b>{title}</b>: {moment.format("llll")}
		</button>
	);

	if (wrapper) {
		return React.cloneElement(wrapper, {}, component);
	}

	return component;
};

export default TimeSpan;
