import TimeSpan from "./TimeSpan";
import { RenderedTimeSpan } from "../constants";
import useContext from "../hooks/useContext";
import { Moment } from "moment";

interface Props {
	timeSpans: RenderedTimeSpan[];
	startDate?: Moment;
}

const Main = ({ timeSpans, startDate }: Props) => {
	const { settings } = useContext();

	return (
		<div id="journal-review">
			{settings.renderOnFileSwitch && startDate ? (
				<h2>On {startDate.format("ll")}...</h2>
			) : (
				<h2>On today...</h2>
			)}

			<ul className="list">
				{timeSpans.map(({ title, notes }) => (
					<TimeSpan key={title} title={title} notes={notes} wrapper={<li />} />
				))}
			</ul>
		</div>
	);
};

export default Main;
