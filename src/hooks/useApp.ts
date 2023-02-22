import * as React from "react";
import { App } from "obsidian";

import AppContext from "src/components/context";

const useApp = (): App => {
	return React.useContext(AppContext);
};

export default useApp;
