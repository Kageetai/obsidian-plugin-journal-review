import { useContext as PreUseContext } from "preact/hooks";

import AppContext from "../components/context";

const useContext = () => PreUseContext(AppContext);

export default useContext;
