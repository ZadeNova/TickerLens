"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { useEffect, useState } from "react"
import { format, formatDate, parseISO } from 'date-fns';
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  //CardDescription,
  CardFooter,
  //CardHeader,
  //CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import Timeframe_btns, { Timeframe } from "./timeframe_btns"
import { TickerHistoricalPriceData, Historical_Timeframes, Historical_Stock_Price_Data_Point } from "@/app/ticker/[tickerName]/page"

export const description = "A line chart"


// Interface for ChartData

export interface Formatted_Stock_Price_Data_Point {
  date: string;
  close: number;
  formattedDate: string;
  originalDate: string;
}
// Keep in mind to change stuff u need to ensure everything is the same. Look at datakey.
const chartConfig = {
    stockPrice:{
        label: "Price",
        color: "#667eea",
    },
} satisfies ChartConfig

// interface ChartLineDefaultProps {
//     data: ChartData[];
// }

// Change this function to take in data , light and dark theme and other stuff
function ChartLineDefault({
    data
}: { data: TickerHistoricalPriceData | null }) {
  
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('YTD');
  const [chartData, setChartData] = useState<Array<Historical_Stock_Price_Data_Point> | null>(data?.price_data.year_to_date || null)

  // For chart X axis time interval
  const [timeInterval, setTimeInterval] = useState(30);


    //Handle Date formatting
  const formatDate_fromdata = (dateString: string, timeframe: Timeframe) => {
    const date = parseISO(dateString);

    switch (timeframe) {
      // case '1D':
      // case '5D':
          // Show intraday timing
      //   return format(date, 'HH:mm');
      case '1M':
      case '6M':
        return format(date, 'MMM dd');
      
      case 'YTD':
      case '1Y':
        // Medium term
        return format(date, "MMM ''yy");

      case '5Y':
        // Long term
        return format(date, 'yyyy');
      
      default:
        return format(date, 'MMM dd')
    }
  }


  const processStockData = (rawData: Historical_Stock_Price_Data_Point[] | undefined, timeframe: Timeframe) => {

    if (!rawData){
      return []
    }
    return rawData.map(item => ({
      ...item,
      formattedDate: formatDate_fromdata(item.date, timeframe),
      originalDate: item.date

    }));
  };
  
  // Formatted Chart Data
  const formattedChartData: Record<Timeframe, Formatted_Stock_Price_Data_Point[]> = {
    // '1D': processStockData(data?.price_data.one_day_ago, '1D'),
    // '5D': processStockData(data?.price_data.five_days_ago, '5D'),
    '1M': processStockData(data?.price_data.one_month_ago ?? [],'1M'),
    '6M': processStockData(data?.price_data.six_months_ago ?? [], '6M'),
    'YTD': processStockData(data?.price_data.year_to_date ?? [],'YTD'),
    '1Y': processStockData(data?.price_data.one_year_ago ?? [],'1Y'),
    '5Y': processStockData(data?.price_data.five_years_ago ?? [],'5Y'),
  }
  
  //console.log(formattedChartData["1M"]);
  
  // handle data fetching for chart
  const handleTimeframeChange = async (newTimeframe: Timeframe) => {
    setSelectedTimeframe(newTimeframe);
    console.log('New timeframed changed')
  }


  
  
  
  // this useEffect will handle datafetching for chart and setting Xaxis time interval
  useEffect(() => {
      switch (selectedTimeframe) {
    // case '1D':
    //   setChartData(data.one_day_ago); // You might need to add this to your interface
    //   break;
    // case '5D':
    //   setChartData(data.five_days_ago); // You might need to add this to your interface
    //   break;
    case '1M':
      //console.log(data?.price_data.one_month_ago)
      setTimeInterval(5);
      setChartData(formattedChartData["1M"]);
      break;
    case '6M':
      setTimeInterval(14);
      setChartData(formattedChartData["6M"]);
      break;
    case 'YTD':
      setTimeInterval(30)
      setChartData(formattedChartData['YTD']);
      break;
    case '1Y':
      setTimeInterval(60)
      setChartData(formattedChartData["1Y"]);
      break;
    case '5Y':
      setTimeInterval(365)
      setChartData(formattedChartData["5Y"]);
      break;
    default:
      // Handle unexpected timeframe or set default
      setTimeInterval(1)
      setChartData(formattedChartData['YTD']);
}
  },[selectedTimeframe])

  // Chart color
  const useChartColors = () => {
  const { theme } = useTheme();
  
  return {
    lineColor: theme === 'dark' ? '#cad8f9' : '#667eea',
    gridColor: theme === 'dark' ? '#666666' : '#e0e0e0',
    textColor: theme === 'dark' ? '#d1d5db' : '#374151',
  };
};

  const { lineColor, gridColor, textColor } = useChartColors();
  

  return (
    <Card>
      <Timeframe_btns selectedTimeframe={selectedTimeframe} onTimeframeChange={handleTimeframeChange}></Timeframe_btns>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-40">
          <LineChart
            accessibilityLayer
            data={chartData ?? []}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} stroke={gridColor}/>
            <XAxis
              dataKey="formattedDate"
              tick={{ fontSize: 15 }}
              tickLine={true}
              axisLine={true}
              tickMargin={5}
              interval={timeInterval} // Interval change it according to timeframe
              //tickFormatter={(value) => value.slice(0, 1)}
              dy={0}
              dx={15}
              stroke={textColor}
          
            />
            <YAxis orientation="right" domain={['dataMin - 10','dataMax + 10']} tickFormatter={(value) => `$${Number(value).toFixed(2)}`} stroke={textColor}></YAxis>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
              formatter={(value) => [`$${Number(value).toFixed(2)}`]}
            />
            <Line
              dataKey="close"
              type="natural"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  )
}

export {
    ChartLineDefault
}