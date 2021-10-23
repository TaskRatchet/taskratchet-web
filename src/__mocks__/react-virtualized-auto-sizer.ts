export default function AutoSizer({ children }: any) {
	return children({ height: 600, width: 600 });
}
