import React, { forwardRef } from 'react';

export const mockReactListRef = {
	scrollTo: jest.fn(),
};

const ReactList = forwardRef(function ReactList(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	{ itemRenderer, length }: any,
	ref
) {
	if (ref && typeof ref === 'object') {
		ref.current = mockReactListRef;
	}
	return <div>{Array.from({ length }, (v, i) => itemRenderer(i))}</div>;
});

export default ReactList;
