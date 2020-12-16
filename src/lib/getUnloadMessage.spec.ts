import {getUnloadMessage} from "./getUnloadMessage";

describe('getUnloadMessage', () => {
    it('does not return message if no pending mutations', async () => {
        expect(getUnloadMessage()).toBeFalsy()
    })

    it('returns message if pending task toggle', async () => {
        // setComplete = useSetComplete
        // setComplete(val)

        expect(getUnloadMessage()).toBeTruthy()
    })
})
