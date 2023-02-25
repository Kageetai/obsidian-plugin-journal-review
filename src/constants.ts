import { moment } from "obsidian";

export enum Unit {
	Days = "days",
	Weeks = "weeks",
	Months = "months",
	Years = "years",
}

export type TimeSpans = Array<[number, Unit]>;

export const defaultTimeSpans: TimeSpans = [
	[1, Unit.Months],
	[6, Unit.Months],
	[1, Unit.Years],
	[2, Unit.Years],
	[3, Unit.Years],
];

export const reduceTimeSpans = (timeSpans: TimeSpans) =>
	timeSpans.reduce<Record<string, moment.Moment>>((acc, t) => {
		acc[moment.duration(...t).humanize(true)] = moment().subtract(...t);
		return acc;
	}, {});

export type Entries<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T][];
