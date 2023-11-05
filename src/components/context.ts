import { createContext } from "preact";
import { App, View } from "obsidian";

import { Settings } from "../constants";

type Context = {
	view: View;
	app: App;
	settings: Settings;
};

const AppContext = createContext<Context>({} as Context);

export default AppContext;
