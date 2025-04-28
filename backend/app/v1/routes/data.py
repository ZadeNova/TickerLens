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
    displayName: str
    previousClose: float
    open: float
    fiftyTwoWeekRange: str
    volume: int
    averageVolume: int
    marketCap: int
    beta: float
    sector: str
    industry: str
    fullTimeEmployees: int



# TODO: Settle Data model first
# TODO: After handling data model settle error validation.
# TODO: Learn about rate limiters and add it to every single route.
# TODO: Display basic data first.

# Get stock ticker
@router.post("/api/v1/stocks/{ticker}")
def get_stock(ticker: str) -> StockDataBasic:
    stock_data = yf.Ticker(ticker).info
    
    return StockDataBasic(**stock_data)
    
@router.post("/api/v1/etfs/{ticker}")
def get_etf(ticker: str):
    #
    pass



