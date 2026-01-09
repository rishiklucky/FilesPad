import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    data: { type: Buffer, required: true },
    path: { type: String, required: false }, // Keeping for backward compatibility or future use, but making optional
    size: { type: Number, required: true },
    mimetype: { type: String, required: true },
    spaceCode: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('File', fileSchema);
