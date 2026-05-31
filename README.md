# StockSignal AI — Indian Intraday Signal Platform

A production-ready AI-assisted intraday trading signal platform for Indian stocks (NSE/BSE), built with React + Vite + Tailwind CSS v4 (frontend) and Node.js + Express + MongoDB (backend).

---

## Features

- **Real-time Signals** — BUY / SELL / HOLD with confidence score
- **Technical Indicators** — EMA 20/50, RSI 14, MACD, ATR 14, Volume
- **Market Overview** — NIFTY, BANKNIFTY, SENSEX live prices
- **Top Gainers & Losers** — NSE large-cap universe
- **Search with Suggestions** — Keyboard-navigable autocomplete
- **Watchlist** — Persistent via MongoDB
- **Signal History** — Track all generated signals
- **Dark Theme** — TradingView-inspired terminal UI
- **Responsive** — Desktop, Tablet, Mobile

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS v4 |
| Backend | Node.js, Express 5 |
| Database | MongoDB (via Mongoose) |
| Market Data | Yahoo Finance (yahoo-finance2) |
| Indicators | technicalindicators |
| HTTP | Axios |

---

## Project Structure

```
root/
├── client/                         # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                 # Reusable: Button, Card, Badge, Input, Modal, Loader, etc.
│   │   │   ├── Navbar.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── MarketOverview.jsx
│   │   │   ├── GainersLosers.jsx
│   │   │   ├── RecentSignals.jsx
│   │   │   ├── SignalCard.jsx
│   │   │   ├── WatchlistPanel.jsx
│   │   │   └── Disclaimer.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── AnalysisPage.jsx
│   │   │   ├── WatchlistPage.jsx
│   │   │   ├── HistoryPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── hooks/
│   │   │   ├── useStock.js
│   │   │   ├── useMarket.js
│   │   │   └── useWatchlist.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AppContext.jsx
│   │   ├── constants/
│   │   │   ├── theme.js
│   │   │   └── stocks.js
│   │   └── styles/
│   │       └── theme.css
│   └── index.html
│
└── server/                         # Express backend
    ├── config/
    │   ├── db.js
    │   └── env.js
    ├── models/
    │   ├── Signal.js
    │   ├── Watchlist.js
    │   └── SearchHistory.js
    ├── services/
    │   └── marketDataService.js
    ├── indicators/
    │   ├── ema.js
    │   ├── rsi.js
    │   ├── macd.js
    │   ├── atr.js
    │   ├── volume.js
    │   └── signalEngine.js
    ├── controllers/
    │   ├── stockController.js
    │   ├── marketController.js
    │   ├── watchlistController.js
    │   └── signalController.js
    ├── routes/
    │   ├── stockRoutes.js
    │   ├── marketRoutes.js
    │   ├── watchlistRoutes.js
    │   └── signalRoutes.js
    ├── middlewares/
    │   ├── errorHandler.js
    │   └── requestLogger.js
    ├── .env
    └── index.js
```

---

## Setup Guide

### Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Variables

Create `server/.env`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/stockanalyzer
NODE_ENV=development
```

> **Note:** If you don't have MongoDB running locally, the app still works — signals are generated and displayed, but history/watchlist won't persist.

### 3. Start MongoDB (if local)

```bash
mongod
```

Or use [MongoDB Atlas](https://www.mongodb.com/atlas) and set `MONGODB_URI` to your Atlas connection string.

### 4. Run Development Servers

**Server** (Terminal 1):
```bash
cd server
npm run dev
# Starts on http://localhost:3000
```

**Client** (Terminal 2):
```bash
cd client
npm run dev
# Starts on http://localhost:5173
```

### 5. Open App

Visit [http://localhost:5173](http://localhost:5173)

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stock/:symbol` | Generate signal for a stock |
| GET | `/api/market/overview` | NIFTY, BANKNIFTY, SENSEX |
| GET | `/api/market/gainers` | Top 10 gainers |
| GET | `/api/market/losers` | Top 10 losers |
| GET | `/api/market/movers` | Gainers + losers combined |
| GET | `/api/signals/recent` | Recent signal history |
| GET | `/api/signals/history/:symbol` | History for specific stock |
| GET | `/api/watchlist` | Get watchlist |
| POST | `/api/watchlist` | Add to watchlist |
| DELETE | `/api/watchlist/:symbol` | Remove from watchlist |

### Signal Response Example

```json
{
  "success": true,
  "data": {
    "symbol": "RELIANCE",
    "currentPrice": 1452.50,
    "signal": "BUY",
    "confidence": 80,
    "entry": 1452.50,
    "stopLoss": 1432.10,
    "target1": 1493.30,
    "target2": 1513.70,
    "reasons": [
      "✓ Price is above EMA20 (short-term bullish trend)",
      "✓ EMA20 is above EMA50 (bullish trend alignment)",
      "✓ RSI at 62.3 — bullish momentum (>55)",
      "✓ MACD is above signal line (bullish)",
      "✓ Volume spike: 1.8× average (strong conviction)"
    ],
    "indicators": {
      "ema20": 1440.25,
      "ema50": 1415.80,
      "rsi": 62.3,
      "macd": 8.45,
      "macdSignal": 5.20,
      "atr": 20.20,
      "volumeAvg": 12500000,
      "currentVolume": 22500000
    }
  }
}
```

---

## Signal Logic

### BUY Signal
| Condition | Points |
|-----------|--------|
| Price > EMA20 | +25 |
| Price > EMA50 | +20 |
| RSI > 55 | +20 |
| MACD Bullish | +20 |
| Volume Spike (>1.3×) | +15 |

> BUY triggered when ≥ 3 buy conditions met (and buy score > sell score)

### Target Calculation
```
Entry   = Current Price
SL      = Entry − ATR
Target1 = Entry + ATR × 2
Target2 = Entry + ATR × 3
```

---

## Stock Symbols

Use NSE symbols without suffix:
- `RELIANCE`, `TCS`, `INFY`, `HDFCBANK`, `SBIN`
- `NIFTY`, `BANKNIFTY`, `SENSEX` (indices)

---

## Disclaimer

> This tool provides AI-assisted trading signals and is **not financial advice**. Trading involves risk. Past performance does not guarantee future results. Please consult a SEBI-registered advisor before investing.
