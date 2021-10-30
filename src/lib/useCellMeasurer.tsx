import React, {
	useRef,
	useEffect,
	useCallback,
	useState,
	useMemo,
	CSSProperties,
} from 'react';
import shortId from 'shortid';
import { renderToString } from 'react-dom/server';
import { VariableSizeListProps } from 'react-window';
import { QueryClientProvider, useQueryClient } from 'react-query';
import { Size } from 'react-virtualized-auto-sizer';

// Source:
// https://codesandbox.io/s/yw4ok6l69z

export default function useCellMeasurer({
	items,
	size,
}: {
	items: JSX.Element[];
	size: Size | undefined;
}): Pick<
	VariableSizeListProps,
	'innerRef' | 'itemSize' | 'itemCount' | 'style'
> & { key: string } {
	const queryClient = useQueryClient();
	const innerRef = useRef<HTMLElement>(null);
	const id = useMemo(shortId, []);
	const [hiddenSizingEl, setHiddenSizingEl] = useState<HTMLElement | null>(
		null
	);

	const itemSize = useCallback(
		(index) => {
			if (!hiddenSizingEl) return 0;

			const item = items[index];

			hiddenSizingEl.innerHTML = renderToString(
				<QueryClientProvider client={queryClient}>{item}</QueryClientProvider>
			);

			return hiddenSizingEl.clientHeight || 0;
		},
		[hiddenSizingEl, items, queryClient]
	);

	useEffect(() => {
		if (!size) return;
		if (hiddenSizingEl) return;

		const newHiddenSizingEl = document.createElement('div');
		const width = size.width;

		newHiddenSizingEl.classList.add(`hidden-sizing-element-${id}`);
		newHiddenSizingEl.style.position = 'absolute';
		newHiddenSizingEl.style.top = '0';
		newHiddenSizingEl.style.width = `${width}px`;
		newHiddenSizingEl.style.pointerEvents = 'none';
		newHiddenSizingEl.style.visibility = 'hidden';

		setHiddenSizingEl(newHiddenSizingEl);

		document.body.appendChild(newHiddenSizingEl);
	}, [hiddenSizingEl, id, size]);

	useEffect(() => {
		return () => {
			const hiddenSizingElement = document.querySelector(
				`.hidden-sizing-element-${id}`
			);

			hiddenSizingElement && document.body.removeChild(hiddenSizingElement);
		};
	}, [id]);

	const key = useMemo(shortId, [itemSize, hiddenSizingEl, size]);
	const style: CSSProperties = hiddenSizingEl ? {} : { visibility: 'hidden' };

	return {
		innerRef,
		itemSize,
		itemCount: items.length,
		key,
		style,
	};
}
