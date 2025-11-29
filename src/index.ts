import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.static('public'));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Keep original filename but prepend timestamp to avoid collisions
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1024 * 10 // 10GB limit (adjust as needed)
    }
});

// Routes
app.post('/upload', upload.array('files'), (req, res) => {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).send('No files uploaded.');
    }
    res.status(200).json({ message: 'Files uploaded successfully.' });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
