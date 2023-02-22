import * as React from "react";
import { getAllDailyNotes } from "obsidian-daily-notes-interface";

interface Props {
	dailyNotes: ReturnType<typeof getAllDailyNotes>;
}

const Main = ({ dailyNotes }: Props) => (
	<div>
		<h4>On this day:</h4>

		{Object.values(dailyNotes).map((dailyNote) => (
			<div key={dailyNote.name}>{dailyNote.name}</div>
		))}
	</div>
);

export default Main;
