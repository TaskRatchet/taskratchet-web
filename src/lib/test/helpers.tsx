import api from "../Api";
import {ParsedQuery} from "query-string";
import browser from "../Browser";

export const makeResponse = (args: {
    ok?: boolean,
    json?: any
} = {}): Response => {
    const {ok = true, json = null} = args

    return {
        ok,
        json: () => Promise.resolve(json),
        arrayBuffer(): Promise<ArrayBuffer> {
            return Promise.resolve(new ArrayBuffer(0));
        },
        blob(): Promise<Blob> {
            return Promise.resolve(new Blob());
        },
        body: null,
        bodyUsed: false,
        clone(): Response {
            return makeResponse();
        },
        formData(): Promise<FormData> {
            return Promise.resolve(new FormData());
        },
        headers: new Headers(),
        redirected: false,
        status: 0,
        statusText: "",
        text(): Promise<string> {
            return Promise.resolve(JSON.stringify(json));
        },
        trailer: Promise.resolve(new Headers()),
        type: "default", // don't know if this is right
        url: "",

    }
}

export const loadMe = ({json = {}, ok = true}: { json?: any, ok?: boolean }) => {
    const response = makeResponse({json, ok});

    jest.spyOn(api, 'getMe').mockResolvedValue(response)
    jest.spyOn(api, 'updateMe').mockResolvedValue(response)
}

export const loadMeWithBeeminder = (user: string = 'bm_user', goal: string = 'bm_goal') => {
    loadMe({
        json: {
            integrations: {
                beeminder: {user, goal_new_tasks: goal}
            }
        }
    })
}

export function loadTimezones() {
    jest.spyOn(api, 'getTimezones').mockResolvedValue(
        makeResponse({json: []})
    )
}

export function loadCheckoutSession() {
    jest.spyOn(api, 'getCheckoutSession').mockResolvedValue(
        makeResponse({json: 'session'})
    )
}

export const loadUrlParams = (params: ParsedQuery) => {
    jest.spyOn(browser, 'getUrlParams').mockReturnValue(params);
}

export const loadNow = (date: Date) => {
    jest.spyOn(browser, 'getNow').mockReturnValue(date)
}

export function expectLoadingOverlay(container: HTMLElement, shouldExist: boolean = true) {
    expect(container.getElementsByClassName('loading').length).toBe(+shouldExist)
}
