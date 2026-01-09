import mongoose from 'mongoose';

const spaceSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Space', spaceSchema);
