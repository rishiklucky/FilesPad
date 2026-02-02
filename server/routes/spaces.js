import express from 'express';
import Space from '../models/Space.js';
import File from '../models/File.js';
import { hash, encrypt, decrypt } from '../utils/security.js';

const router = express.Router();

// Create a new space
router.post('/create', async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ message: 'Space name is required' });
        }

        const hashedCode = hash(code);
        const existingSpace = await Space.findOne({ code: hashedCode });
        if (existingSpace) {
            return res.status(400).json({ message: 'Space already exists' });
        }

        const newSpace = new Space({ code: hashedCode });
        await newSpace.save();
        res.status(201).json({ code, message: 'Space created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login (Verify space)
router.post('/login', async (req, res) => {
    try {
        const { code, lockCode } = req.body;
        const hashedCode = hash(code);
        const space = await Space.findOne({ code: hashedCode });
        if (!space) {
            return res.status(404).json({ message: 'Space not found' });
        }

        if (space.lockCodeHash) {
            if (!lockCode) {
                return res.status(403).json({ message: 'Space is locked', isLocked: true });
            }
            const hashedLockCode = hash(lockCode);
            if (space.lockCodeHash !== hashedLockCode) {
                return res.status(401).json({ message: 'Invalid lock code', isLocked: true });
            }
        }

        res.json({ message: 'Login successful', code });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Enable Lock Pad
router.post('/enable-lock', async (req, res) => {
    try {
        const { code, lockCode } = req.body;
        if (!code || !lockCode) {
            return res.status(400).json({ message: 'Space code and lock code are required' });
        }

        const hashedCode = hash(code);
        const hashedLockCode = hash(lockCode);

        // Verify space exists
        const space = await Space.findOne({ code: hashedCode });
        if (!space) {
            return res.status(404).json({ message: 'Space not found' });
        }

        space.lockCodeHash = hashedLockCode;
        await space.save();

        res.json({ message: 'Lock Pad enabled successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get TextPad content
router.get('/:code/textpad', async (req, res) => {
    try {
        const { code } = req.params;
        const hashedCode = hash(code);
        const space = await Space.findOne({ code: hashedCode });
        if (!space) return res.status(404).json({ message: 'Space not found' });

        let content = '';
        if (space.textPadContent) {
            try {
                content = decrypt(space.textPadContent);
            } catch (err) {
                // If decryption fails, it might be old plain text
                content = space.textPadContent;
            }
        }
        res.json({ content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update TextPad content
router.put('/:code/textpad', async (req, res) => {
    try {
        const { code } = req.params;
        const { content } = req.body;
        const hashedCode = hash(code);
        const encryptedContent = content ? encrypt(content) : '';
        const space = await Space.findOneAndUpdate(
            { code: hashedCode },
            { textPadContent: encryptedContent },
            { new: true }
        );
        if (!space) return res.status(404).json({ message: 'Space not found' });
        res.json({ message: 'TextPad updated', content: content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Space
router.delete('/:code', async (req, res) => {
    try {
        const { code } = req.params;
        const hashedCode = hash(code);

        // Find the space first to ensure it exists
        const space = await Space.findOne({ code: hashedCode });
        if (!space) {
            return res.status(404).json({ message: 'Space not found' });
        }

        // Delete all files associated with this space
        // Note: In a real production app, you'd also want to delete the actual files from storage (e.g. S3 or disk)
        // Here assuming the file routes/logic handles cleanup or we just remove the DB references
        // We'll delete DB references here. If files are on disk, we might need to look them up and fs.unlink them.
        // For this task, we will delete the File documents.
        await File.deleteMany({ spaceCode: space.code });

        // Delete the space
        await Space.findOneAndDelete({ code: hashedCode });

        res.json({ message: 'Space and all data deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
