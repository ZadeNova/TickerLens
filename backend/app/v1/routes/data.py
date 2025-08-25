from fastapi import APIRouter , HTTPException
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional , Dict , Union , List


import os
import requests
import yfinance as yf
import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta, date
from dateutil.relativedelta import relativedelta
import pytz


# Load variables from env files
load_dotenv()
#Access the variables
fmp_key = os.getenv("fmp_api_key")
finange_key = os.getenv("finange_api_key")
router = APIRouter()


# Pydantic Data Models
class StockDataBasic(BaseModel):
    symbol: str
    displayName: str
    volume: int
    averageVolume: int
    marketCap: int
    beta: Optional[float] = None
    sector: str
    industry: str
    fullTimeEmployees: int
    longBusinessSummary: str
    website: str
    open: float
    dayLow: float
    dayHigh: float
    currentPrice: float
    previousClose: float
    fiftyTwoWeekRange: str
    # Profitability
    profitMargins: float
    operatingMargins: float
    # Management Effectiveness.
    returnOnAssets: float
    returnOnEquity: float
    #Balance Sheet
    totalCash: float
    totalCashPerShare: float
    totalDebt: float
    debtToEquity: float
    currentRatio: float
    quickRatio: float
    # Fundamental Ratios
    # Have to comment out trailingPE if not there will be an error.
    #trailingPE: float
    forwardPE: float
    bookValue: float
    priceToBook: float
    trailingEps: float
    forwardEps: float
    ebitda: Optional[float] = None
    totalDebt: float



class ETFDataBasic(BaseModel):
    symbol: str
    description: str
    fund_overview: dict
    fund_operations: dict
    asset_classes: dict
    top_holdings: dict
    equity_holdings: dict
    sector_weightings: dict

class ReturnsMetrics(BaseModel):
    ytd_return: float
    one_year_return: float
    three_year_return: float
    five_year_return: float


class BenchmarkResponses(BaseModel):
    other_tickers: Optional[Dict[str, ReturnsMetrics]] = {}
    benchmark_returns: ReturnsMetrics

    def get_ticker(self, symbol: str) -> ReturnsMetrics:
        "Helper to access a specific ticker's returns"
        return self.other_tickers[symbol]


class PricePoint(BaseModel):
    date: date
    close: float


class Historical_price_data_response(BaseModel):
    price_data: Dict[str, List[PricePoint]]


# Builder function for returns benchmark
def create_response(ticker: str , ticker_data: dict, spy_data: dict) -> BenchmarkResponses:
    return BenchmarkResponses(
        ticker = ticker,
        ticker_returns = ReturnsMetrics(**ticker_data),
        benchmark_returns = ReturnsMetrics(**spy_data)
    )

# TODO: Settle Data model first
# TODO: After handling data model settle error validation.
# TODO: Learn about rate limiters and add it to every single route.
# TODO: Display basic data first.



# Test function
@router.post("/api/v1/test/{ticker}")
def test_func(ticker:str):
    test_ticker = yf.Ticker(ticker)
    print(test_ticker.history(start="2024-01-01",end="2025-08-13",interval="1d"))
    return "It worked"



# Get stock ticker
@router.post("/api/v1/stocks/{ticker}")
def get_stock(ticker: str) -> StockDataBasic:
    stock_data = yf.Ticker(ticker).info
    
    return StockDataBasic(**stock_data)

@router.post("/api/v1/stocks/allinfo/{ticker}")
def get_allinfo_stock(ticker : str):
    stock_data = yf.Ticker(ticker).info
    
    return stock_data

@router.post("/api/v1/stocks/returns/{ticker}")
def get_stock_benchmark(ticker: str) -> BenchmarkResponses:
    price_history = yf.Ticker(ticker).history(period="10y")
    spy_index_price_history = yf.Ticker("^GSPC").history(period="10y")
    
    # Calculate total returns for the YTD , 1Y ago , 3Y ago and 5Y ago.
      
    # Use US timezone
    us_timezone = pytz.timezone("America/New_York")
    today_date = datetime.now(us_timezone).replace(hour=0,minute=0,second=0,microsecond=0)
    ytd_date = datetime(today_date.year, 1, 1, tzinfo=us_timezone)
    one_year_ago = today_date - relativedelta(years=1)
    three_years_ago = today_date - relativedelta(years=3)
    five_years_ago = today_date - relativedelta(years=5)

    # This should be a function. Calculate both ticker and SPY index returns
    try:
        returns_dict = {"ytd_return":ytd_date,"one_year_return":one_year_ago,"three_year_return":three_years_ago,"five_year_return":five_years_ago}

        spy_index_returns_dict = {"ytd_return":ytd_date,"one_year_return":one_year_ago,"three_year_return":three_years_ago,"five_year_return":five_years_ago}
        for key in returns_dict:

            returns_dict[key] = get_return(price_history, returns_dict[key] , today_date)

            spy_index_returns_dict[key] = get_return(spy_index_price_history, spy_index_returns_dict[key], today_date)
            
        #print(returns_dict)
    except Exception as e:
        print(f'ERROR ERROR ERROR ${e} ERROR ERROR')

    #print(price_history_reset.info())
    #response = create_response(ticker , returns_dict , spy_index_returns_dict)
    response = BenchmarkResponses(
        benchmark_returns = spy_index_returns_dict,
        other_tickers = { ticker: ReturnsMetrics(**returns_dict) }
    )
    print(response)
    return response
    
def get_return(df: pd.DataFrame , start_date, end_date):
    
    # Find nearest trading days
    start_idx = df.index.get_indexer([start_date], method="nearest")[0]
    end_idx = df.index.get_indexer([end_date], method="nearest")[0]

    
    start_price = df.iloc[start_idx]['Close']
    end_price = df.iloc[end_idx]['Close']
    
    return np.round(((end_price - start_price) / start_price) * 100,2)


# Get Stock Historical Price Data
@router.post("/api/v1/stocks/historicaldata/{ticker}")
def get_historical_data_stock(ticker: str):

    # Get Stock price history
    stock_price_history = yf.Ticker(ticker).history(period="max")

    # Use US timezone
    us_timezone = pytz.timezone("America/New_York")
    today_date = datetime.now(us_timezone).replace(hour=0,minute=0,second=0,microsecond=0)
    ytd_date = datetime(today_date.year, 1, 1, tzinfo=us_timezone)
    one_month_ago = today_date - relativedelta(months=1)
    six_months_ago = today_date - relativedelta(months=6)
    one_year_ago = today_date - relativedelta(years=1)
    three_years_ago = today_date - relativedelta(years=3)
    five_years_ago = today_date - relativedelta(years=5)

    print(today_date, "TODAYS DATE")

    try:
        price_data_by_timeframe = {
            "one_month_ago": one_month_ago,
            "six_months_ago": six_months_ago,
            "year_to_date":ytd_date,
            "one_year_ago":one_year_ago,
            "three_years_ago":three_years_ago,
            "five_years_ago":five_years_ago,
        }

        for key in price_data_by_timeframe:
            price_data_by_timeframe[key] = extract_historical_price_data_from_dataframe(stock_price_history,today_date,price_data_by_timeframe[key])
        
        # Find a way and use pydantic model for this
        #print(price_data_by_timeframe)
        print("Historical function is working!")
        #return Historical_price_data_response(price_data=price_data_by_timeframe)
        return Historical_price_data_response(price_data=price_data_by_timeframe)
    except Exception as e:
        print(f"There is an error {e}")



    
def extract_historical_price_data_from_dataframe(df: pd.DataFrame,todays_date,historical_date):
    # Find nearest trading days
    #print(todays_date,historical_date)
    historical_date_idx = df.index[df.index.get_indexer([historical_date], method="nearest")[0]]
    todays_date_idx = df.index[df.index.get_indexer([todays_date], method="nearest")[0]]
    
    price_data = df.loc[historical_date_idx:todays_date_idx]

    
    return [
        PricePoint(date=index.date(), close=row["Close"])
        for index, row in price_data.iterrows()
    ]


    

# Get ETF data
@router.post("/api/v1/etfs/{ticker}")
def get_etf(ticker: str) -> Optional[ETFDataBasic]:
    etf_data = yf.Ticker(ticker).funds_data
    
    data_dict = {
        "symbol": ticker,
        "description": getattr(etf_data,"description",None),
        "fund_overview": getattr(etf_data,"fund_overview",{}),
        "fund_operations": getattr(etf_data,"fund_operations",{}),
        "asset_classes": getattr(etf_data,"asset_classes",{}),
        "top_holdings": getattr(etf_data,"top_holdings",{}),
        "equity_holdings": getattr(etf_data,"equity_holdings",{}),
        "sector_weightings": getattr(etf_data,"sector_weightings",{})
    }

    # Data processing to convert dataframe to dict.
    processed_data = {}
    for key, value in data_dict.items():
        if isinstance(value , pd.DataFrame):
            processed_data[key] = value.to_dict()
        else:
            processed_data[key] = value
    
    etf_data_model = ETFDataBasic(**{k: v for k, v in processed_data.items() if v is not None})
    
    return etf_data_model



