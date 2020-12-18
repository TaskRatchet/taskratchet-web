import queryString, {ParsedQuery} from "query-string";

export class Browser {
    getLanguages(): string[] {
        return navigator.languages.slice()
    }

    getDateTimeString(date: Date): string {
        const day = this.getDayName(date);
        const dateString = this.getDateString(date);
        const timeString = this.getTimeString(date);

        return `${day}, ${dateString}, ${timeString}`
    }

    getDayName(date: Date): string {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        return days[date.getDay()];
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

    getNow(): Date {
        return new Date()
    }

    getUrlParams(): ParsedQuery {
        return queryString.parse(window.location.search)
    }
}

const browser = new Browser();

export default browser;
