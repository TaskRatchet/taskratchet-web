import React, { forwardRef } from 'react';

export const mockReactListRef = {
	scrollTo: jest.fn(),
};

beforeEach(() => {
	mockReactListRef.scrollTo.mockReset();
});

const ReactList = forwardRef(function ReactList(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	{ itemRenderer, length }: any,
	ref
) {
	if (ref) {
		if (typeof ref === 'object') {
			ref.current = mockReactListRef;
		}
		if (ref instanceof Function) {
			ref(mockReactListRef);
		}
	}
	return <div>{Array.from({ length }, (v, i) => itemRenderer(i))}</div>;
});

export default ReactList;
