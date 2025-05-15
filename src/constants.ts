import { moment, TFile } from "obsidian";
import {
	type getAllDailyNotes,
	getDailyNote,
	getDateFromFile,
} from "obsidian-daily-notes-interface";

export const DEBOUNCE_DELAY = 1000;
export const VIEW_TYPE = "on-this-day-view";

export enum Unit {
	day = "day",
	week = "week",
	month = "month",
	year = "year",
}

type AllDailyNotes = ReturnType<typeof getAllDailyNotes>;

/**
 * TimeSpan type to define possible time span user can define
 * consisting of a number, e.g. 6, a unit, e.g. months, and whether it's recurring
 * @example {number: 1, unit: Unit.month, recurring: false}
 */
export type TimeSpan = {
	number: number;
	unit: Unit;
	recurring?: boolean;
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

export type RandomNotePosition = "top" | "bottom";

export interface Settings {
	timeSpans: TimeSpan[];
	dayMargin: number;
	previewLength: number;
	useHumanize: boolean;
	useCallout: boolean;
	useQuote: boolean;
	openInNewPane: boolean;
	showNoteTitle: boolean;
	useNotifications: boolean;
	renderOnFileSwitch: boolean;
	date: string;
	noteMarkdownRegex: string;
	showRandomNote: boolean;
	randomNotePosition: RandomNotePosition;
}

export const DEFAULT_SETTINGS: Settings = {
	timeSpans: defaultTimeSpans,
	dayMargin: 0,
	previewLength: 100,
	useHumanize: true,
	useCallout: true,
	useQuote: true,
	openInNewPane: false,
	showNoteTitle: true,
	useNotifications: true,
	renderOnFileSwitch: false,
	date: "",
	noteMarkdownRegex: "",
	showRandomNote: false,
	randomNotePosition: "bottom",
};

export const getTimeSpanTitle = ({ number, unit, recurring }: TimeSpan) =>
	`${recurring ? "every" : ""} ${number} ${unit}${number > 1 ? "s" : ""}`;

const reduceToOldestNote = (oldestDate: moment.Moment, currentNote: TFile) => {
	const currentDate = getDateFromFile(currentNote, "day");
	return currentDate?.isBefore(oldestDate) ? currentDate : oldestDate;
};

const getTitle = (
	useHumanize: boolean,
	now: moment.Moment,
	startDate: moment.Moment,
	unit: Unit,
) =>
	useHumanize
		? now.from(startDate)
		: `${getTimeSpanTitle({ number: startDate.diff(now, unit), unit })} ago`;

const getNotesOverMargins = (
	dayMargin: number,
	mom: moment.Moment,
	allDailyNotes: AllDailyNotes,
) =>
	Array.from({ length: dayMargin * 2 + 1 }, (_, i) =>
		getDailyNote(moment(mom).add(i - dayMargin, "days"), allDailyNotes),
	).filter(Boolean);
const sortRenderedTimeSpanByDateDesc = (
	a: RenderedTimeSpan,
	b: RenderedTimeSpan,
) => (a.moment.isAfter(b.moment) ? -1 : 1);

const isDuplicateNote = (note: TFile, notes: TFile[]) =>
	notes.some((existingNote) => existingNote.path === note.path);

const getRandomDailyNote = (allDailyNotes: AllDailyNotes) => {
	const dailyNotes = Object.values(allDailyNotes);
	const randomIndex = Math.floor(Math.random() * dailyNotes.length);
	return dailyNotes[randomIndex];
};

export const reduceTimeSpans = (
	allDailyNotes: AllDailyNotes,
	settings: Settings,
	startDate: moment.Moment = moment(),
): RenderedTimeSpan[] => {
	const oldestNoteDate = Object.values(allDailyNotes).reduce(
		reduceToOldestNote,
		startDate,
	);

	const renderedTimeSpans = Object.values(
		settings.timeSpans.reduce<Record<string, RenderedTimeSpan>>(
			(acc, { number, unit, recurring }) => {
				const mom = moment(startDate);

				// if we have a recurring time span, we want to go back until we reach the oldest note
				do {
					// go back one unit of the timespan
					mom.subtract(number, unit);

					const title = getTitle(settings.useHumanize, mom, startDate, unit);
					const notes = getNotesOverMargins(
						settings.dayMargin,
						mom,
						allDailyNotes,
					);

					if (notes.length) {
						// used mapped object type to group notes together under same titles,
						// even if they come from different time span settings
						acc[title] = {
							title,
							moment: mom,
							notes: acc[title]
								? acc[title].notes.concat(
										notes.filter(
											(note) => !isDuplicateNote(note, acc[title].notes),
										),
									)
								: notes,
						};
					}
				} while (mom.isAfter(oldestNoteDate) && recurring);

				return acc;
			},
			{},
		),
	).sort(sortRenderedTimeSpanByDateDesc);

	// add a random note to the top or bottom of the list
	// if the user has set the option
	if (settings.showRandomNote) {
		const randomNote = getRandomDailyNote(allDailyNotes);
		const randomNoteTimeSpan: RenderedTimeSpan = {
			title: "a random day",
			notes: [randomNote],
			moment: moment(randomNote.stat.mtime),
		};

		if (settings.randomNotePosition === "top") {
			renderedTimeSpans.unshift(randomNoteTimeSpan);
		} else {
			renderedTimeSpans.push(randomNoteTimeSpan);
		}
	}

	return renderedTimeSpans;
};
