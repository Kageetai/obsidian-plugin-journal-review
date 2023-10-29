import * as React from "preact";
import { TFile } from "obsidian";

import TimeSpan from "./TimeSpan";

interface Props {
	timeSpans: Array<{
		title: string;
		notes: TFile[];
	}>;
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
