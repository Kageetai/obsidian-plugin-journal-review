import * as React from "react";

import AppContext from "src/components/context";

const useAllDailyNotes = () => React.useContext(AppContext).allDailyNotes;

export default useAllDailyNotes;
