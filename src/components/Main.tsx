import * as React from "preact";

import TimeSpan from "./TimeSpan";
import { RenderedTimeSpans } from "../constants";

interface Props {
	timeSpans: RenderedTimeSpans;
}

const Main = ({ timeSpans }: Props) => (
	<div id="journal-review">
		<h2>On this day...</h2>

		<ul className="list">
			{timeSpans.map(({ title, notes }) => (
				<TimeSpan
					key={title}
					title={title}
					notes={notes}
					wrapper={<li />}
				/>
			))}
		</ul>
	</div>
);

export default Main;
