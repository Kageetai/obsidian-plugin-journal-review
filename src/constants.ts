import { moment } from "obsidian";
import { getAllDailyNotes, getDailyNote } from "obsidian-daily-notes-interface";
import { Settings } from "./main";

export const DEBOUNCE_DELAY = 500;
export const VIEW_TYPE = "on-this-day-view";
export const SETTINGS_UPDATED_EVENT = "journal-review:settings-updated";

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
	useHumanize: boolean
) =>
	timeSpans.map(([number, unit]) => {
		const mom = moment().subtract(number, unit);
		const humanizedTitle = moment.duration(-number, unit).humanize(true);

		return {
			title: useHumanize ? humanizedTitle : `${number} ${unit}`,
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
