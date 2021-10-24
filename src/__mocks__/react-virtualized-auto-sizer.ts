export default function AutoSizer({
	children,
}: {
	children: CallableFunction;
}) {
	return children({ height: 600, width: 600 });
}
