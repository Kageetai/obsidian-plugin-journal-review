import { moment, TFile } from "obsidian";
import {
	getAllDailyNotes,
	getDailyNote,
	getDateFromFile,
} from "obsidian-daily-notes-interface";
import { Settings } from "./main";

export const DEBOUNCE_DELAY = 1000;
export const VIEW_TYPE = "on-this-day-view";
export const SETTINGS_UPDATED_EVENT = "journal-review:settings-updated";

export enum Unit {
	day = "day",
	week = "week",
	month = "month",
	year = "year",
}

export type AllDailyNotes = ReturnType<typeof getAllDailyNotes>;

/**
 * TimeSpan type to define possible time span user can define
 * consisting of a number, e.g. 6, a unit, e.g. months, and whether it's recurring
 * @example {number: 1, unit: Unit.months, recurring: false}
 */
export type TimeSpan = {
	number: number;
	unit: Unit;
	recurring: boolean;
};

export type RenderedTimeSpan = {
	title: string;
	notes: TFile[];
	moment: moment.Moment;
};

export const defaultTimeSpans: TimeSpan[] = [
	{ number: 1, unit: Unit.month, recurring: false },
	{ number: 6, unit: Unit.month, recurring: false },
	{ number: 1, unit: Unit.year, recurring: true },
];

export const DEFAULT_SETTINGS: Settings = {
	timeSpans: defaultTimeSpans,
	dayMargin: 0,
	previewLength: 100,
	useHumanize: true,
};

export const getTimeSpanTitle = ({ number, unit, recurring }: TimeSpan) =>
	`${recurring ? "every" : ""} ${number} ${unit}${number > 1 ? "s" : ""}`;

const getNotesOverMargins = (
	dayMargin: number,
	mom: moment.Moment,
	allDailyNotes: AllDailyNotes,
) =>
	Array(dayMargin * 2 + 1)
		.fill(0)
		.map((_, i) =>
			getDailyNote(moment(mom).add(i - dayMargin, "days"), allDailyNotes),
		)
		.filter(Boolean);

export const reduceTimeSpans = (
	timeSpans: TimeSpan[],
	allDailyNotes: AllDailyNotes,
	dayMargin: number,
	useHumanize: boolean,
): RenderedTimeSpan[] => {
	const oldestNoteDate = Object.values(allDailyNotes).reduce(
		(oldestDate, currentNote) => {
			const currentDate = getDateFromFile(currentNote, "day");
			if (currentDate?.isBefore(oldestDate)) {
				return currentDate;
			}
		},
		moment(),
	);

	return Object.values(
		timeSpans.reduce<Record<string, RenderedTimeSpan>>(
			(acc, { number, unit, recurring }) => {
				const mom = moment();

				// if we have a recurring time span, we want to go back until we reach the oldest note
				do {
					mom.subtract(number, unit);
					const title = useHumanize
						? mom.fromNow()
						: getTimeSpanTitle({ number, unit, recurring });
					// used mapped object type to group notes together under same titles,
					// even if they come from different time span settings
					acc[title] = {
						title,
						moment: mom,
						notes: getNotesOverMargins(
							dayMargin,
							mom,
							allDailyNotes,
						),
					};
				} while (mom.isAfter(oldestNoteDate) && recurring);

				return acc;
			},
			{},
		),
	).sort((a, b) => (a.moment.isBefore(b.moment) ? 1 : -1));
};
