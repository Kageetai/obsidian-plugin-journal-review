import { useContext as PreUseContext } from "preact/hooks";

import AppContext from "src/components/context";

const useContext = () => PreUseContext(AppContext);

export default useContext;
