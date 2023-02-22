import * as React from "react";

import AppContext from "src/components/context";

const useApp = () => React.useContext(AppContext).app;

export default useApp;
