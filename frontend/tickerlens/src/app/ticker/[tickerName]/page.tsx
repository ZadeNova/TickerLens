import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { ChartLineIcon } from "lucide-react";



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


interface TickerData {
    symbol:              string;
    displayName:         string;
    previousClose:       number;
    open:                number;
    fiftyTwoWeekRange:   string;
    volume:              number;
    averageVolume:       number;
    marketCap:           number;
    beta:                number;
    sector:              string;
    industry:            string;
    fullTimeEmployees:   number;
    longBusinessSummary: string;
    dayLow:              number;
    dayHigh:             number;
    currentPrice:        number;
}

interface ReturnMetrics {
	ytd_return: number;
	one_year_return: number;
	three_year_return: number;
	five_year_return: number;
}

interface BenchmarkComparisonResponse {
	benchmark_returns: ReturnMetrics;
	other_tickers: {
		[ticker: string]: ReturnMetrics;
	};
}

interface IndividualTickerComparisonData {
	ticker: string,
	ticker_returns: ReturnMetrics,
	benchmark_returns: ReturnMetrics,
}

const performance_labelMap = [
	"YTD",
	"1 Year",
	"3 Year",
	"5 Year",
    ]

const performanceMetricsKeys: (keyof ReturnMetrics)[] = [
  "ytd_return",
  "one_year_return",
  "three_year_return",
  "five_year_return"
];    

interface TickerAndBenchmarkDataPoint {
  label: string;
  tickerValue: number;
  benchmarkValue: number;
}

type TickerBenchmarkData = TickerAndBenchmarkDataPoint[];

function formatNumbers(number?: number) {
	
	if (number === undefined) return "N/A";

	const formatter = Intl.NumberFormat("en",{notation: "compact"});
	return formatter.format(number);
}

// Print the card element 4 times. Have a datastructure to loop from

async function getReturnsData(ticker: string): Promise<TickerBenchmarkData | null>{
	try {
		const response = await fetch(`http://127.0.0.1:8000/api/v1/stocks/returns/${ticker}`,
			{
				method: "POST",
				next: { revalidate: 900},
			}
		);

		if (!response.ok){
			console.error(`Server responded with status ${response.status}`);
			return null;
		}

		const tickers_and_benchmark_returns_data = await response.json();
		const individual_ticker_comparison : IndividualTickerComparisonData | string = getTickerComparisonData(tickers_and_benchmark_returns_data, ticker);
		if (typeof individual_ticker_comparison === 'string'){
			console.error(individual_ticker_comparison)
		}
		else{
			const { ticker_returns , benchmark_returns } : IndividualTickerComparisonData = individual_ticker_comparison;

			const cardData = performance_labelMap.map((label, index) => ({
			label: label,
			tickerValue: ticker_returns[performanceMetricsKeys[index]],
			benchmarkValue: benchmark_returns[performanceMetricsKeys[index]]
			}))

			return cardData;
		}
		
		
		
		return tickers_and_benchmark_returns_data
	}
	catch(error){
		console.log("Fetch failed: ",error)
		return null;
	}
}

function getTickerComparisonData(data: BenchmarkComparisonResponse, ticker: string) : IndividualTickerComparisonData | string {
	if (data.other_tickers && data.other_tickers.hasOwnProperty(ticker)) {
		return {
			ticker: ticker,
			ticker_returns: data.other_tickers[ticker],
			benchmark_returns: data.benchmark_returns
		};
	}
	else {
		return `Ticker "${ticker}" not found in the data`
	}
}

async function getTickerData(ticker: string): Promise<TickerData | null> {

	try {
		const response = await fetch(
			`http://127.0.0.1:8000/api/v1/stocks/${ticker}`,
			{
				method: "POST",
				next: { revalidate: 900 },
			}
		);

		if (!response.ok){
			console.error(`Server responded with status ${response.status}`);
			return null;
		}

		const data: TickerData = await response.json();

		return data;

	} catch(error){
		console.log("Fetch failed: ",error)
		return null;
	}

}

export default async function tickerInfo({
	params,
}: {
	params: { tickerName: string };
}) {
	const { tickerName } = await params;
	console.log(tickerName);
	// const data = await getTickerData(tickerName);
	// const data = {
	// 	symbol: "RKLB",
	// 	displayName: "RocketLab USA",
	// 	industry: "Aerospace",
	// }; 
	

	// const stock_returns_data: TickerBenchmarkData | null = await getReturnsData(tickerName);
	
	const [stock_returns_data , data] = await Promise.all([
		getReturnsData(tickerName),
		getTickerData(tickerName)
	])

	return (
		<>
			<div className="p-5 bg-slate-100 dark:bg-slate-800 min-h-screen">
				<div className="max-w-5xl mx-auto">
					<h1 className="text-2xl font-bold mb-4">
						{data?.displayName} ({data?.symbol})
					</h1>
					<div className="flex">
						<h3 className="font-bold mb-4">Current Price: ${data?.currentPrice.toFixed(2)}</h3>
					</div>
					<div className="card p-2 w-full h-32 border-2 shimmer">
						
						<div className="justify-center items-center flex flex-col">
							<span className="text-indigo-500 font-bold">
								Chart is still in development.
								
							</span>
							<ChartLineIcon className="w-10 h-10 text-violet-500 mb-2" />
						</div>
					</div>
					{/* Display stock basic data first */}
					<div className="card p-2 w-full overflow-hidden mt-2 h-46 sm:h-32 sm:mt-4">
						<dl className="grid grid-cols-4 gap-x-4 gap-y-2 md:grid-cols-8 text-xs sm:text-sm">
							<dt>Previous Close</dt>
							<dd>${data?.previousClose}</dd>
							<dt>Day&apos;s range</dt>
							<dd>${data?.dayLow.toFixed(2)} - ${data?.dayHigh.toFixed(2)}</dd>
							<dt>Market Cap</dt>
							<dd>{formatNumbers(data?.marketCap)}</dd>
							<dt>Beta</dt>
							<dd>{data?.beta}</dd>
							<dt>Open</dt>
							<dd>${data?.open}</dd>
							<dt>52-week range</dt>
							<dd>{data?.fiftyTwoWeekRange}</dd>
							<dt>Full Time Employees</dt>
							<dd>{data?.fullTimeEmployees}</dd>
							<dt>Sector</dt>
							<dd>{data?.sector}</dd>
						</dl>
					</div>

					{/* Display the company's basic background */}
					<Accordion type="single" collapsible>
						<AccordionItem value="item-1">
							<AccordionTrigger>Company&apos;s Summary</AccordionTrigger>
							<AccordionContent>
								<p>{data?.longBusinessSummary}</p>
							</AccordionContent>
						</AccordionItem>
					</Accordion>

					<div className="mt-4">
						<h1>Performance Overview: </h1>
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-4">
						{ stock_returns_data && stock_returns_data.map((data) => (
							<Card key={data.label}>
								<CardHeader>
									<CardTitle className="flex justify-center items-center">{data.label} performance</CardTitle>
									<CardDescription></CardDescription>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-2 grid-rows-2 gap-x-4 justify-center items-center">
										<div className="flex justify-center items-center">
											<p>{tickerName}</p>
										</div>
										<div className="flex justify-center items-center">
											<p>S&P 500</p>
										</div>
										<div className={`flex justify-center items-center text-xs sm:text-sm md:text-sm lg:text-base ${data.tickerValue >= 0 ? 'text-green-500' : 'text-red-500'}`}>
											<p>{ data.tickerValue >= 0 ? `+${data.tickerValue}%` : `-${Math.abs(data.tickerValue)}%`}</p>
										</div>
										<div className={`flex justify-center items-center text-xs sm:text-sm md:text-sm lg:text-base ${data.benchmarkValue >= 0 ? 'text-green-500' : 'text-red-500'}`}>
											<p>{ data.benchmarkValue >= 0 ? `+${data.benchmarkValue}%` : `-${Math.abs(data.benchmarkValue)}%`}</p>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
						
						
						</div>

					</div>
				</div>
			</div>
		</>
	);
}
