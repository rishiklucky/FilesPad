import express from 'express';
import Space from '../models/Space.js';
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
        const { code } = req.body;
        const hashedCode = hash(code);
        const space = await Space.findOne({ code: hashedCode });
        if (!space) {
            return res.status(404).json({ message: 'Space not found' });
        }
        res.json({ message: 'Login successful', code });
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

export default router;
