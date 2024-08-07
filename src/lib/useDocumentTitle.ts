import { useRef, useEffect } from 'react';

// https://dev.to/luispa/how-to-add-a-dynamic-title-on-your-react-app-1l7k
function useDocumentTitle(title: string, prevailOnUnmount = false) {
	const defaultTitle = useRef(document.title);

	useEffect(() => {
		document.title = title;
	}, [title]);

	useEffect(
		() => () => {
			if (!prevailOnUnmount) {
				document.title = defaultTitle.current;
			}
		},
		[prevailOnUnmount],
	);
}

export default useDocumentTitle;
