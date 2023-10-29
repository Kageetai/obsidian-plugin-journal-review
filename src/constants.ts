import { moment } from "obsidian";
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
	days = "days",
	weeks = "weeks",
	months = "months",
	years = "years",
}

export type AllDailyNotes = ReturnType<typeof getAllDailyNotes>;

/**
 * TimeSpans type to define possible time spans user can define
 * consisting of a number, e.g. 6, a unit, e.g. months, and whether it's recurring
 * @example [{number: 1, unit: Unit.months, recurring: false}]
 */
export type TimeSpans = Array<{
	number: number;
	unit: Unit;
	recurring: boolean;
}>;

export const defaultTimeSpans: TimeSpans = [
	{ number: 1, unit: Unit.months, recurring: false },
	{ number: 6, unit: Unit.months, recurring: false },
	{ number: 1, unit: Unit.years, recurring: true },
];

export const DEFAULT_SETTINGS: Settings = {
	timeSpans: defaultTimeSpans,
	dayMargin: 0,
	previewLength: 100,
	useHumanize: true,
};

const getNotesOverMargins = (
	dayMargin: number,
	mom: moment.Moment,
	allDailyNotes: AllDailyNotes,
) =>
	Array(dayMargin * 2 + 1)
		.fill(0)
		.map((_, i) =>
			getDailyNote(mom.add(i - dayMargin, "days"), allDailyNotes),
		)
		.filter(Boolean);

export const mapTimeSpans = (
	timeSpans: TimeSpans,
	allDailyNotes: AllDailyNotes,
	dayMargin: number,
	useHumanize: boolean,
) => {
	const oldestNoteDate = Object.values(allDailyNotes).reduce(
		(oldestDate, currentNote) => {
			const currentDate = getDateFromFile(currentNote, "day");
			if (currentDate?.isBefore(oldestDate)) {
				return currentDate;
			}
		},
		moment(),
	);

	return timeSpans.map(({ number, unit, recurring }) => {
		const notes = [];
		const mom = moment();
		const humanizedTitle = moment.duration(-number, unit).humanize(true);

		do {
			mom.subtract(number, unit);
			notes.push(...getNotesOverMargins(dayMargin, mom, allDailyNotes));
			// if we have a recurring time span, we want go back until we reach the oldest note
		} while (mom.isAfter(oldestNoteDate) && recurring);

		return {
			title: useHumanize ? humanizedTitle : `${number} ${unit}`,
			notes,
		};
	});
};
