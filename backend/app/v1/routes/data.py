from fastapi import APIRouter , HTTPException
from dotenv import load_dotenv
from pydantic import BaseModel

import os
import requests
import yfinance as yf


# Load variables from env files
load_dotenv()
#Access the variables
fmp_key = os.getenv("fmp_api_key")
finange_key = os.getenv("finange_api_key")
router = APIRouter()


# Pydantic Data Models
class StockDataBasic(BaseModel):
    symbol: str
    display_name: str
    previous_close: float
    open: float
    day_price_range: float
    fiftytwo_week_range: float
    volume: int
    avg_volume: int
    market_cap: int
    beta: float
    sector: str
    industry: str
    full_time_employees: str



# TODO: Settle Data model first
# TODO: After handling data model settle error validation.
# TODO: Learn about rate limiters and add it to every single route.
# TODO: Display basic data first.

# Get stock ticker
@router.post("/api/v1/stocks/{ticker}")
def get_stock(ticker: str):
    stock_data = yf.Ticker(ticker)
    
    return stock_data.info
    
@router.post("/api/v1/etfs/{ticker}")
def get_etf(ticker: str):
    #
    pass



