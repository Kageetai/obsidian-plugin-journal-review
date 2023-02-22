import * as React from "react";

import { reviewTimeSpans } from "../constants";
import TimeSpan from "./TimeSpan";

const Main = () => (
	<div>
		<h3>On this day:</h3>

		{Object.entries(reviewTimeSpans).map(([key, moment]) => (
			<TimeSpan key={key} span={key} moment={moment} />
		))}
	</div>
);

export default Main;
