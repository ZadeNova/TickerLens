from fastapi import APIRouter , HTTPException
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional


import os
import requests
import yfinance as yf
import pandas as pd
import json

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
    longBusinessSummary: str
    dayLow: float
    dayHigh: float
    currentPrice: float

class ETFDataBasic(BaseModel):
    symbol: str
    description: str
    fund_overview: dict
    fund_operations: dict
    asset_classes: dict
    top_holdings: dict
    equity_holdings: dict
    sector_weightings: dict





# TODO: Settle Data model first
# TODO: After handling data model settle error validation.
# TODO: Learn about rate limiters and add it to every single route.
# TODO: Display basic data first.

# Get stock ticker
@router.post("/api/v1/stocks/{ticker}")
def get_stock(ticker: str) -> StockDataBasic:
    stock_data = yf.Ticker(ticker).info
    
    return StockDataBasic(**stock_data)

@router.post("/api/v1/stocks/allinfo/{ticker}")
def get_allinfo_stock(ticker : str):
    stock_data = yf.Ticker(ticker).info
    
    return stock_data
    
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



