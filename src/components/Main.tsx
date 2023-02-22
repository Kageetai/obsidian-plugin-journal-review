import * as React from "react";
import { getAllDailyNotes } from "obsidian-daily-notes-interface";
import { reviewTimeSpans } from "../constants";
import TimeSpan from "./TimeSpan";

interface Props {
	allDailyNotes: ReturnType<typeof getAllDailyNotes>;
}

const Main = ({ allDailyNotes }: Props) => {
	return (
		<div>
			<h3>On this day:</h3>

			{Object.entries(reviewTimeSpans).map(([key, moment]) => (
				<TimeSpan
					allDailyNotes={allDailyNotes}
					key={key}
					span={key}
					moment={moment}
				/>
			))}
		</div>
	);
};

export default Main;
