import { mkdirSync, readFileSync, writeFileSync } from "fs";
import * as moment from "moment";

interface PeriodicNotesSettings {
	daily: {
		format: string;
		folder: string;
		template: string;
		enabled: boolean;
	};
}

const vaultPath = `${process.cwd()}/${process.argv[2]}`;
const years = process.argv[3];
const notesPerDay = parseInt(process.argv[4]) || 1;
const today = moment();
const yearsAgo = moment().subtract(years, "years");
const settingsPath = `${vaultPath}/.obsidian/plugins/periodic-notes/data.json`;
const settings = JSON.parse(
	readFileSync(settingsPath).toString(),
) as PeriodicNotesSettings;
const dailyPath = `${vaultPath}${settings.daily.folder || "/"}`;

for (let m = yearsAgo; m.diff(today, "days") <= 0; m.add(1, "days")) {
	for (let i = 0; i < notesPerDay; i++) {
		const innerM = m.clone().add(i, "hours");
		const dailyNoteFormat = innerM.format(settings.daily.format);

		mkdirSync(
			`${dailyPath}${dailyNoteFormat.split("/").slice(0, -1).join("/")}`,
			{ recursive: true },
		);

		writeFileSync(
			`${dailyPath}${dailyNoteFormat}.md`,
			`daily Note for ${dailyNoteFormat}`,
		);
	}
}
