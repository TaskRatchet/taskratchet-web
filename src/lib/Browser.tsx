import queryString, {ParsedQuery} from "query-string";

export class Browser {
    getLanguages(): string[] {
        return navigator.languages.slice()
    }

    getDateString(date: Date): string {
        return date.toLocaleDateString(browser.getLanguages())
    }

    getTimeString(date: Date): string {
        return date.toLocaleTimeString(browser.getLanguages(), {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    getUrlParams(): ParsedQuery {
        return queryString.parse(window.location.search)
    }
}

const browser = new Browser();

export default browser;
