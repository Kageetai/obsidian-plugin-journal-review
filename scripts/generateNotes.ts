import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { moment } from "obsidian";

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
const today = moment();
const yearsAgo = moment().subtract(years, "years");
const settingsPath = `${vaultPath}/.obsidian/plugins/periodic-notes/data.json`;
const settings = JSON.parse(
	readFileSync(settingsPath).toString(),
) as PeriodicNotesSettings;
const dailyPath = `${vaultPath}${settings.daily.folder || "/"}`;

for (let m = yearsAgo; m.diff(today, "days") <= 0; m.add(1, "days")) {
	const dailyNoteFormat = m.format(settings.daily.format);
	mkdirSync(
		`${dailyPath}${dailyNoteFormat.split("/").slice(0, -1).join("/")}`,
		{ recursive: true },
	);
	writeFileSync(
		`${dailyPath}${dailyNoteFormat}.md`,
		`daily Note for ${dailyNoteFormat}`,
	);
}
