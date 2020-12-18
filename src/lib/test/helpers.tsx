import api from "../LegacyApi";
import * as new_api from "../../lib/api"
import {ParsedQuery} from "query-string";
import browser from "../Browser";
import {QueryClient, QueryClientProvider} from "react-query";
import React, {ReactElement} from "react";
import {render} from "@testing-library/react";
import _ from "lodash";

jest.mock('../../lib/api/getTimezones')

export const makeResponse = (args: {
    ok?: boolean,
    json?: any
} = {}): Partial<Response> => {
    const {ok = true, json = null} = args

    return {
        ok,
        json: () => Promise.resolve(json),
        text(): Promise<string> {
            return Promise.resolve(JSON.stringify(json));
        },
    }
}

export const loadMe = ({json = {}, ok = true}: { json?: any, ok?: boolean }) => {
    const response = makeResponse({json, ok});

    jest.spyOn(new_api, 'getMe').mockResolvedValue(json)
    jest.spyOn(new_api, 'updateMe').mockResolvedValue(response as Response)
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

export function loadTimezones(timezones: string[] = []) {
    jest.spyOn(new_api, 'getTimezones').mockResolvedValue(timezones)
}

export function loadCheckoutSession() {
    jest.spyOn(new_api, 'getCheckoutSession').mockResolvedValue({
        id: 'session'
    })
}

export const loadUrlParams = (params: ParsedQuery) => {
    jest.spyOn(browser, 'getUrlParams').mockReturnValue(params);
}

export const loadNow = (date: Date) => {
    jest.spyOn(browser, 'getNow').mockReturnValue(date)
}

export function expectLoadingOverlay(container: HTMLElement, options: {
    shouldExist?: boolean,
    extraClasses?: string
} = {}) {
    const {
        shouldExist = true,
        extraClasses = ''
    } = options

    expect(container.getElementsByClassName(`loading ${extraClasses}`).length).toBe(+shouldExist)
}

export async function renderWithQueryProvider(ui: ReactElement) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false
            }
        }
    })

    const result = await render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)

    return {
        ...result,
        queryClient
    }
}
