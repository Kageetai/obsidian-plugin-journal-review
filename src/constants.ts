import { moment } from "obsidian";

export const reviewTimeSpans = {
	oneMonth: moment().subtract(1, "months"),
	sixMonths: moment().subtract(6, "months"),
	oneYear: moment().subtract(1, "years"),
	twoYears: moment().subtract(2, "years"),
	threeYears: moment().subtract(3, "years"),
};

export type Entries<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T][];
