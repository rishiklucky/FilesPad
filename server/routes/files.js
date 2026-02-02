import express from 'express';
import multer from 'multer';
import QRCode from 'qrcode';
import path from 'path';
import File from '../models/File.js';
import { encrypt, decrypt, hash } from '../utils/security.js';

const router = express.Router();

// Multer Config: Memory Storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload File
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { spaceCode, duration } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ message: 'No file uploaded' });

        // Calculate Expiration
        const days = parseFloat(duration) || 1;
        const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

        // Encrypt sensitive names
        const virtualFilename = Date.now() + '-' + file.originalname;
        const encryptedFilename = encrypt(virtualFilename);
        const encryptedOriginalName = encrypt(file.originalname);

        // Create File Object
        const newFile = new File({
            filename: encryptedFilename,
            originalName: encryptedOriginalName,
            data: file.buffer,
            size: file.size,
            mimetype: file.mimetype,
            spaceCode: hash(spaceCode),
            expiresAt
        });

        const savedFile = await newFile.save();

        // Generate download URL
        const fileUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/api/files/download/${savedFile._id}`;

        // QR Code
        const qrCodeDataUrl = await QRCode.toDataURL(fileUrl);

        res.status(201).json({
            message: 'File uploaded',
            file: {
                ...newFile.toObject(),
                originalName: file.originalname, // Return decrypted name for immediate UI update
                filename: virtualFilename
            },
            link: fileUrl,
            qrCode: qrCodeDataUrl
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get Files for Space
router.get('/:spaceCode', async (req, res) => {
    try {
        const hashedSpaceCode = hash(req.params.spaceCode);
        const files = await File.find({ spaceCode: hashedSpaceCode }).select('-data').lean(); // Exclude data buffer for performance

        const mappedFiles = files.map(file => {
            let originalName = file.originalName;
            let filename = file.filename;

            // Try to decrypt
            try {
                originalName = decrypt(file.originalName);
                filename = decrypt(file.filename);
            } catch (e) {
                // If decryption fails, it might be legacy unencrypted data
            }

            return {
                _id: file._id,
                filename: filename,
                originalName: originalName,
                size: file.size,
                mimetype: file.mimetype,
                expiresAt: file.expiresAt,
                downloadUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/api/files/download/${file._id}`
            };
        });

        res.json(mappedFiles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Download File Route
router.get('/download/:id', async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ message: 'File not found' });

        let originalName = file.originalName;
        try {
            originalName = decrypt(file.originalName);
        } catch (e) {
            // Ignore if not encrypted
        }

        res.set('Content-Type', file.mimetype);
        res.set('Content-Disposition', `inline; filename="${originalName}"`);
        res.send(file.data);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete File
router.delete('/:id', async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ message: 'File not found' });

        await File.findByIdAndDelete(req.params.id);

        res.json({ message: 'File deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
