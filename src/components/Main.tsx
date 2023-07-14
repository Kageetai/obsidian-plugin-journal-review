import * as React from "preact";
import { TFile } from "obsidian";

import TimeSpan from "./TimeSpan";

interface Props {
	timeSpans: Array<{
		title: string;
		moment: moment.Moment;
		notes: TFile[];
	}>;
}

const Main = ({ timeSpans }: Props) => (
	<div id="journal-review">
		<h2>On this day...</h2>

		<ul className="list">
			{timeSpans.map(({ title, moment, notes }) => (
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

export default Main;
