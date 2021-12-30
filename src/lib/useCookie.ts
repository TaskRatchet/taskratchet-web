import { useState } from 'react';

// https://dev.to/dqunbp/store-state-in-cookies-with-use-cookie-value-react-hook-4i4f
// https://codesandbox.io/s/usecookie-sandbox-3cpls?file=/src/useCookie.jsx

const getItem = (key: string): unknown => {
	const stringValue = document.cookie
		.split('; ')
		.reduce((total, currentCookie) => {
			const item = currentCookie.split('=');
			const storedKey = item[0];
			const storedValue = item[1];

			return key === storedKey ? decodeURIComponent(storedValue) : total;
		}, '');

	return JSON.parse(stringValue);
};

const setItem = (key: string, value: unknown, numberOfDays: number): void => {
	const now = new Date();
	now.setTime(now.getTime() + numberOfDays * 60 * 60 * 24 * 1000);

	const stringValue = JSON.stringify(value);

	document.cookie = `${key}=${stringValue}; expires=${now.toUTCString()}; path=/`;
};

const useCookie = (
	key: string,
	defaultValue: unknown
): [unknown, (value: unknown, numberOfDays: number) => void] => {
	const getCookie = () => getItem(key) || defaultValue;
	const [cookie, setCookie] = useState(getCookie());

	const updateCookie = (value: unknown, numberOfDays: number) => {
		setCookie(value);
		setItem(key, value, numberOfDays);
	};

	return [cookie, updateCookie];
};

export default useCookie;
