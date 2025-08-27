export const getCookie = (key: string): string => {
	const cookies = document.cookie.split('; ');
	const cookie = cookies.find((c) => c.startsWith(`${key}=`));
	const value = cookie?.split('=')[1] ?? '';

	return decodeURIComponent(value);
};
