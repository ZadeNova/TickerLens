import { Button } from "@/components/ui/button";

export type Timeframe = '1D' | '5D' | '1M' | '6M' | 'YTD' | '1Y' | '5Y'; 

interface TimeButtonProp {
    selectedTimeframe: Timeframe
    onTimeframeChange: (timeframe: Timeframe) => void
}

const timeframes: Timeframe[] = ['1D','5D','1M','6M','YTD','1Y','5Y'];

export default function Timeframe_btns({ selectedTimeframe, onTimeframeChange }: TimeButtonProp) {

  return (
    <>

      <div className="isolate flex -space-x-px m-3 ml-10 sm:ml-5 sm:m-1.5">
        {
            timeframes.map((timeframe) => (

                <Button variant="outline" className={`${timeframe === '1D' ? 'rounded-r-none' : timeframe === '5Y' ? 'rounded-l-none' : 'rounded-none' } focus:z-10 size-2 sm:size-9 ${selectedTimeframe === timeframe ? 'text-[#667eea]' : 'font-white'}`} key={timeframe} onClick={() => onTimeframeChange(timeframe)}>
                {timeframe}
                </Button>

            ))
        }
        
      </div>
    </>
  );
}
