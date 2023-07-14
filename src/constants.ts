import { moment } from "obsidian";
import { getAllDailyNotes, getDailyNote } from "obsidian-daily-notes-interface";

export const DEBOUNCE_DELAY = 500;
export const VIEW_TYPE = "on-this-day-view";

export enum Unit {
	Days = "days",
	Weeks = "weeks",
	Months = "months",
	Years = "years",
}

export type AllDailyNotes = ReturnType<typeof getAllDailyNotes>;

export type TimeSpans = Array<[number, Unit]>;

export const defaultTimeSpans: TimeSpans = [
	[1, Unit.Months],
	[6, Unit.Months],
	[1, Unit.Years],
	[2, Unit.Years],
	[3, Unit.Years],
];

export const mapTimeSpans = (
	timeSpans: TimeSpans,
	allDailyNotes: AllDailyNotes,
	dayMargin: number
) =>
	timeSpans.map(([number, unit]) => {
		const mom = moment().subtract(number, unit);

		return {
			title: moment.duration(-number, unit).humanize(true),
			moment: mom,
			notes: Array(dayMargin * 2 + 1)
				.fill(0)
				.map((_, i) =>
					getDailyNote(
						moment(mom).add(i - dayMargin, "days"),
						allDailyNotes
					)
				)
				.filter(Boolean),
		};
	});

export type Entries<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T][];
