import {useQueryClient} from "react-query";
import {useBeforeunload} from "react-beforeunload";
import {getUnloadMessage} from "./getUnloadMessage";

export function useCloseWarning() {
    const client = useQueryClient()
    useBeforeunload(() => getUnloadMessage(client))
}
