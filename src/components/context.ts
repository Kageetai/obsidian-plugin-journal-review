import * as React from "react";
import { App } from "obsidian";
import { getAllDailyNotes } from "obsidian-daily-notes-interface";

type Context = {
	app: App;
	allDailyNotes: ReturnType<typeof getAllDailyNotes>;
};

const AppContext = React.createContext<Context>({} as Context);

export default AppContext;
