export default async function tickerInfo({
	params,
}: {
	params: Promise<{ tickerName: string }>;
}) {
	const { tickerName } = await params;

	return (
		<>
			<h1> Hello there</h1>
			<p>{tickerName}</p>
		</>
	);
}
