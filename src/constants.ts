import { moment } from "obsidian";

export const reviewTimeSpans = [
	[-1, "months"],
	[-6, "months"],
	[-1, "years"],
	[-2, "years"],
	[-3, "years"],
].reduce<Record<string, moment.Moment>>((acc, t) => {
	acc[moment.duration(...t).humanize(true)] = moment().add(...t);
	return acc;
}, {});

export type Entries<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T][];
