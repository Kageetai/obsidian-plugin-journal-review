import * as React from "preact";

import { mapTimeSpans } from "../constants";
import TimeSpan from "./TimeSpan";
import useContext from "src/hooks/useContext";

const Main = () => {
	const {
		settings: { timeSpans },
	} = useContext();

	const entries = mapTimeSpans(timeSpans);

	return (
		<div id="journal-review">
			<h2>On this day...</h2>

			<ul className="list">
				{entries.map(({ title, moment }) => (
					<TimeSpan
						key={title}
						title={title}
						moment={moment}
						wrapper={<li />}
					/>
				))}
			</ul>
		</div>
	);
};

export default Main;
