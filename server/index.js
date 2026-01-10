import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cron from 'node-cron';

import spaceRoutes from './routes/spaces.js';
import fileRoutes from './routes/files.js';
import File from './models/File.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());



// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/filespad')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/spaces', spaceRoutes);
app.use('/api/files', fileRoutes);

// Serve static assets in production
// Check if we are in production or if the client build exists
// Serve static assets in production
// Check if we are in production or if the client build exists
const __filename = fileURLToPath(import.meta.url); // Need to define this again since I removed it above
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));

    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        // Don't serve index.html for api routes if they haven't matched
        if (req.path.startsWith('/api')) {
            return res.status(404).json({ message: 'API route not found' });
        }
        res.sendFile(path.resolve(clientDistPath, 'index.html'));
    });
}

// Cleanup Job (Runs every hour)
// Cleanup Job (Runs every minute)
cron.schedule('* * * * *', async () => {
    const now = new Date();
    try {
        const expiredFiles = await File.find({ expiresAt: { $lt: now } });
        if (expiredFiles.length > 0) {
            for (const file of expiredFiles) {
                await File.findByIdAndDelete(file._id);
                console.log(`[Auto-Delete] Deleted expired file: ${file.originalName}`);
            }
        }
    } catch (err) {
        console.error('Cleanup error:', err);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
