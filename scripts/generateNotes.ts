import { mkdirSync, readFileSync, writeFileSync } from "fs";
import * as moment from "moment";

interface DailyNotesSettings {
	format: string;
	folder: string;
	template: string;
}

const vaultPath = `${process.cwd()}/${process.argv[2]}`;
const years = process.argv[3];
const notesPerDay = parseInt(process.argv[4]) || 1;
const today = moment();
const yearsAgo = moment().subtract(years, "years");
const settingsPath = `${vaultPath}/.obsidian/daily-notes.json`;
const settings = JSON.parse(
	readFileSync(settingsPath).toString(),
) as DailyNotesSettings;
const dailyPath = `${vaultPath}${settings.folder || "/"}`;

for (let m = yearsAgo; m.diff(today, "days") <= 0; m.add(1, "days")) {
	for (let i = 0; i < notesPerDay; i++) {
		const innerM = m.clone().add(i, "hours");
		const dailyNoteFormat = innerM.format(settings.format);

		mkdirSync(
			`${dailyPath}${dailyNoteFormat.split("/").slice(0, -1).join("/")}`,
			{ recursive: true },
		);

		// console.log("innerM", innerM, innerM.format(settings.format));
		writeFileSync(
			`${dailyPath}${dailyNoteFormat}.md`,
			`daily Note for ${dailyNoteFormat}`,
		);
	}
}
