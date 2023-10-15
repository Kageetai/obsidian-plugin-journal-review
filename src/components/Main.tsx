import * as React from "preact";

import { mapTimeSpans } from "../constants";
import TimeSpan from "./TimeSpan";
import useContext from "../hooks/useContext";

const Main = () => {
	const {
		settings: { timeSpans, dayMargin, useHumanize },
		allDailyNotes,
	} = useContext();

	const entries = mapTimeSpans(
		timeSpans,
		allDailyNotes,
		dayMargin,
		useHumanize
	);

	return (
		<div id="journal-review">
			<h2>On this day...</h2>

			<ul className="list">
				{entries.map(({ title, moment, notes }) => (
					<TimeSpan
						key={title}
						title={title}
						moment={moment}
						notes={notes}
						wrapper={<li />}
					/>
				))}
			</ul>
		</div>
	);
};

export default Main;
