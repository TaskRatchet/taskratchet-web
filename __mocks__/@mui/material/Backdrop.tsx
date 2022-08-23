import React from 'react';

const Bg = ((await vi.importActual('@mui/material/Backdrop')) as any).default;

export default function Backdrop(props: any) {
	throw new Error('We got called');
	/*return (
		<Bg
			{...props}
			component={() => {
				return <div data-testid="mui-backdrop"></div>;
			}}
		/>
	);*/
}
