import * as React from "react";

import { Entries, reviewTimeSpans } from "../constants";
import TimeSpan from "./TimeSpan";

type ReviewEntries = Entries<typeof reviewTimeSpans>;
const entries = Object.entries(reviewTimeSpans) as ReviewEntries;

const Main = () => (
	<div>
		<h3>On this day:</h3>

		<ul className="list">
			{entries.map(([key, moment]) => (
				<TimeSpan
					key={key}
					span={key}
					moment={moment}
					wrapper={<li />}
				/>
			))}
		</ul>
	</div>
);

export default Main;
