import { createContext } from "preact";
import { App, View } from "obsidian";
import { getAllDailyNotes } from "obsidian-daily-notes-interface";
import { Settings } from "src/main";

type Context = {
	view: View;
	app: App;
	settings: Settings;
	allDailyNotes: ReturnType<typeof getAllDailyNotes>;
};

const AppContext = createContext<Context>({} as Context);

export default AppContext;
