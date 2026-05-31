import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, uppercase: true, trim: true, unique: true },
    companyName: { type: String, default: '' },
    lastPrice: { type: Number, default: 0 },
    lastSignal: { type: String, enum: ['BUY', 'SELL', 'HOLD', ''], default: '' },
  },
  { timestamps: true }
);

const Watchlist = mongoose.model('Watchlist', watchlistSchema);
export default Watchlist;
