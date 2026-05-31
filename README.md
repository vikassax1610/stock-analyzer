Here's a shorter and cleaner version of your README: 

# StockSignal AI

AI-powered intraday stock signal platform for Indian markets (NSE/BSE) built with **React + Vite** and **Node.js + Express**.

## Features

* BUY / SELL / HOLD signals
* Confidence score
* EMA, RSI, MACD, ATR & Volume analysis
* Market overview (NIFTY, BANKNIFTY, SENSEX)
* Top 10 Gainers & Losers
* Stock search with suggestions
* Watchlist management
* Signal history tracking
* Dark theme UI
* Fully responsive

## Tech Stack

**Frontend**

* React
* Vite
* Tailwind CSS

**Backend**

* Node.js
* Express

**Database**

* MongoDB

**Market Data**

* Yahoo Finance API

## Project Structure

```text
root/
├── client/   # React Frontend
└── server/   # Express Backend
```

## Installation

### Backend

```bash
cd server
npm install
```

### Frontend

```bash
cd client
npm install
```

## Environment Variables

Create `server/.env`

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/stocksignal
NODE_ENV=development
```

## Run Application

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd client
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:3000`

## Main APIs

| Method | Endpoint                 |
| ------ | ------------------------ |
| GET    | `/api/stock/:symbol`     |
| GET    | `/api/market/overview`   |
| GET    | `/api/market/gainers`    |
| GET    | `/api/market/losers`     |
| GET    | `/api/signals/recent`    |
| GET    | `/api/watchlist`         |
| POST   | `/api/watchlist`         |
| DELETE | `/api/watchlist/:symbol` |

## Signal Logic

**BUY Signal Conditions**

* Price > EMA20
* Price > EMA50
* RSI > 55
* MACD Bullish
* Volume Spike

Signal is generated when most bullish conditions are met.

### Targets

```text
Entry   = Current Price
SL      = Entry - ATR
Target1 = Entry + (ATR × 2)
Target2 = Entry + (ATR × 3)
```

## Supported Symbols

```text
RELIANCE
TCS
INFY
HDFCBANK
SBIN
NIFTY
BANKNIFTY
SENSEX
```

## Disclaimer

This project provides AI-assisted trading signals for educational purposes only and should not be considered financial advice. Always do your own research before investing.
