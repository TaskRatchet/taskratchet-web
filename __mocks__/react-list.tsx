import { forwardRef } from 'react';
import { vi, beforeEach } from 'vitest';

declare module 'react-list' {
	const __listRef: {
		scrollTo: (index: number) => void;
	};
}

export const __listRef = {
	scrollTo: vi.fn(),
};

beforeEach(() => {
	__listRef.scrollTo.mockReset();
});

const ReactList = forwardRef(function ReactList(
	{
		itemRenderer,
		length,
	}: { itemRenderer: (i: number) => JSX.Element; length: number },
	ref,
) {
	if (ref) {
		if (typeof ref === 'object') {
			ref.current = __listRef;
		}
		if (ref instanceof Function) {
			ref(__listRef);
		}
	}
	return <div>{Array.from({ length }, (_v, i) => itemRenderer(i))}</div>;
});

export default ReactList;
