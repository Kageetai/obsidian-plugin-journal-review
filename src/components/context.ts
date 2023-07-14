import { createContext } from "preact";
import { App, View } from "obsidian";
import { AllDailyNotes } from "../constants";
import { Settings } from "src/main";

type Context = {
	view: View;
	app: App;
	settings: Settings;
	allDailyNotes: AllDailyNotes;
};

const AppContext = createContext<Context>({} as Context);

export default AppContext;
