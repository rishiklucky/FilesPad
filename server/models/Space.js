import mongoose from 'mongoose';

const spaceSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  textPadContent: { type: String, default: '' },
  lockCodeHash: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Space', spaceSchema);
