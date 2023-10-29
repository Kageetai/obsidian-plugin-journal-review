import { moment } from "obsidian";
import { getAllDailyNotes, getDailyNote } from "obsidian-daily-notes-interface";
import { Settings } from "./main";

export const DEBOUNCE_DELAY = 500;
export const VIEW_TYPE = "on-this-day-view";
export const SETTINGS_UPDATED_EVENT = "journal-review:settings-updated";

export enum Unit {
	days = "days",
	weeks = "weeks",
	months = "months",
	years = "years",
}

export type AllDailyNotes = ReturnType<typeof getAllDailyNotes>;

/**
 * TimeSpans type to define possible time spans user can define
 * @example [1, 'months'] // Include notes from 1 month ago
 * @example [6, 'months', true] // Include notes from every 6 months ago
 */
export type TimeSpans = Array<[number, Unit, boolean]>;

export const defaultTimeSpans: TimeSpans = [
	[1, Unit.months, false],
	[6, Unit.months, false],
	[1, Unit.years, true],
];

export const DEFAULT_SETTINGS: Settings = {
	timeSpans: defaultTimeSpans,
	dayMargin: 0,
	previewLength: 100,
	useHumanize: true,
};

export const mapTimeSpans = (
	timeSpans: TimeSpans,
	allDailyNotes: AllDailyNotes,
	dayMargin: number,
	useHumanize: boolean,
) => {
	// const oldestNoteDate = Object.values(allDailyNotes).reduce(
	// 	(oldestDate, currentNote) => {
	// 		const currentDate = getDateFromFile(currentNote, "day");
	// 		if (currentDate?.isBefore(oldestDate)) {
	// 			return currentDate;
	// 		}
	// 	},
	// 	moment(),
	// );
	//
	// const date = moment();
	// const notes = [];
	//
	// while (date.isAfter(oldestNoteDate)) {
	// 	date.subtract(1, "month");
	// 	notes.push(getDailyNote(date, allDailyNotes));
	// }
	//
	// console.log("mapTimeSpans", notes);

	return timeSpans.map(([number, unit]) => {
		const mom = moment().subtract(number, unit);
		const humanizedTitle = moment.duration(-number, unit).humanize(true);
		const margins = Array(dayMargin * 2 + 1).fill(0);

		return {
			title: useHumanize ? humanizedTitle : `${number} ${unit}`,
			moment: mom,
			notes: margins
				.map((_, i) =>
					getDailyNote(
						moment(mom).add(i - dayMargin, "days"),
						allDailyNotes,
					),
				)
				.filter(Boolean),
		};
	});
};

export type Entries<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T][];
