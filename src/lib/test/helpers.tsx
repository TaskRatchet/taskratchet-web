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
