import * as React from "react";

import { reduceTimeSpans } from "../constants";
import TimeSpan from "./TimeSpan";
import useContext from "src/hooks/useContext";

const Main = () => {
	const {
		settings: { timeSpans },
	} = useContext();

	const entries = Object.entries(reduceTimeSpans(timeSpans));

	return (
		<div>
			<h2>On this day</h2>

			<ul className="list">
				{entries.map(([key, moment]) => (
					<TimeSpan
						key={key}
						title={key}
						moment={moment}
						wrapper={<li />}
					/>
				))}
			</ul>
		</div>
	);
};

export default Main;
