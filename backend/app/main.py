from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .v1.routes import data
# uvicorn app.main:app --reload


# App name can be called TickerLens
# Basic version of this app , is to analyse a singular stock first. Display important information about the stock.
app = FastAPI()
app.include_router(data.router)
# Add URL 
origins = []

app.add_middleware(CORSMiddleware,
                   allow_origins=origins,
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"],)




