import mongoose from 'mongoose';

const searchHistorySchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, uppercase: true, trim: true },
    searchedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

searchHistorySchema.index({ searchedAt: -1 });

const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);
export default SearchHistory;
