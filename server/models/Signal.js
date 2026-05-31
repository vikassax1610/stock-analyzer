import mongoose from 'mongoose';

const signalSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, uppercase: true, trim: true },
    currentPrice: { type: Number, required: true },
    signal: { type: String, enum: ['BUY', 'SELL', 'HOLD'], required: true },
    confidence: { type: Number, required: true, min: 0, max: 100 },
    entry: { type: Number, required: true },
    stopLoss: { type: Number, required: true },
    target1: { type: Number, required: true },
    target2: { type: Number, required: true },
    reasons: [{ type: String }],
    indicators: {
      ema20: Number,
      ema50: Number,
      rsi: Number,
      macd: Number,
      macdSignal: Number,
      atr: Number,
      volumeAvg: Number,
      currentVolume: Number,
    },
  },
  { timestamps: true }
);

// Index for fast recent lookups
signalSchema.index({ createdAt: -1 });
signalSchema.index({ symbol: 1, createdAt: -1 });

const Signal = mongoose.model('Signal', signalSchema);
export default Signal;
