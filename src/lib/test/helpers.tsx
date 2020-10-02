import api from "../Api";
import {ParsedQuery} from "query-string";
import browser from "../Browser";

interface MakeResponseArgs {
    ok?: boolean,
    json?: any
}

export const makeResponse = (args: MakeResponseArgs = {}): Response => {
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
            return Promise.resolve("");
        },
        trailer: Promise.resolve(new Headers()),
        type: "default", // don't know if this is right
        url: "",

    }
}

export const loadMe = (json: any) => {
    const response = makeResponse({json});

    jest.spyOn(api, 'getMe').mockResolvedValue(response)
    jest.spyOn(api, 'updateMe').mockResolvedValue(response)
}

export const loadMeWithBeeminder = (user: string = 'bm_user', goal: string = 'bm_goal') => {
    loadMe({
        integrations: {
            beeminder: {user, goal}
        }
    })
}

export const loadUrlParams = (params: ParsedQuery) => {
    jest.spyOn(browser, 'getUrlParams').mockReturnValue(params);
}
