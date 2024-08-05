export const setCookie = (
	key: string,
	value: unknown,
	numberOfDays: number,
): void => {
	const now = new Date();
	now.setTime(now.getTime() + numberOfDays * 60 * 60 * 24 * 1000);

	const stringValue = JSON.stringify(value);

	document.cookie = `${key}=${stringValue}; expires=${now.toUTCString()}; path=/`;
};
