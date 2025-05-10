import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

// Configure metadata for this page
export async function generateMetadata({
	params,
}: {
	params: { tickerName: string };
}) {
	const { tickerName } = await params;
	const tickerName_decoded = decodeURIComponent(tickerName);
	return {
		title: `${tickerName_decoded}`,
		description: "",
	};
}

// export const metadata: Metadata = {
// 	title:`{}`,
// 	description:"",
// }

//export async function generateMetadata()

async function getTickerData(ticker: string) {
	const response = await fetch(
		`http://127.0.0.1:8000/api/v1/stocks/${ticker}`,
		{
			method: "POST",
			next: { revalidate: 900 },
		}
	);

	if (!response.ok) return null;

	const data = await response.json();
	//console.log(data);
	return data;
}

export default async function tickerInfo({
	params,
}: {
	params: { tickerName: string };
}) {
	const { tickerName } = await params;
	console.log(tickerName);
	//const data = await getTickerData(tickerName);
	const data = {
		symbol: "RKLB",
		displayName: "RocketLab USA",
		industry: "Aerospace",
	};
	return (
		<>
			<div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
				<div className="max-w-5xl mx-auto">
					<h1 className="text-2xl font-bold mb-4">
						{data.displayName} ({data.symbol})
					</h1>
					<div className="flex">
						<h3 className="font-bold mb-4">Current Price: ${}</h3>
					</div>
					<div className="rounded-lg shadow-md bg-gray-200 p-2 w-full h-24">
						<div className="justify-center items-center flex">
							<span className="text-indigo-500 font-bold">
								Chart is still in development.
							</span>
						</div>
					</div>
					{/* Display stock basic data first */}
					<div className="bg-indigo-50 rounded-lg shadow-md shadow-indigo-100 p-2 w-full mt-2 h-24 sm:h-32 sm:mt-4 ">
						<dl className="grid grid-cols-4 gap-x-4 gap-y-2 md:grid-cols-8 text-sm">
							<dt>Previous Close</dt>
							<dd></dd>
							<dt>Day&apos;s range</dt>
							<dd></dd>
							<dt>Market Cap</dt>
							<dd></dd>
							<dt>Beta</dt>
							<dd></dd>
							<dt>Open</dt>
							<dd></dd>
							<dt>52-week range</dt>
							<dd></dd>
							<dt>Full Time Employees</dt>
							<dd></dd>
							<dt>Sector</dt>
							<dd></dd>
						</dl>
					</div>

					{/* Display the company's basic background */}
					<Accordion type="single" collapsible>
						<AccordionItem value="item-1">
							<AccordionTrigger>Company&apos;s Summary</AccordionTrigger>
							<AccordionContent>
								Yes. It adheres to the WAI-ARIA design pattern.
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</div>
		</>
	);
}
