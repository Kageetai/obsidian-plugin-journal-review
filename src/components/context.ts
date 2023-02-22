import * as React from "react";
import { App } from "obsidian";

const AppContext = React.createContext<App>({} as App);

export default AppContext;
