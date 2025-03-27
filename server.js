import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const __dirname = path.resolve(); // Get the directory name

const app = express();
app.use(cors());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// File upload endpoint
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ imageUrl: `http://localhost:5000/uploads/${req.file.filename}` });
});

// Serve uploaded files statically
app.use("/uploads", express.static(uploadDir));

const PORT = 5001; // You can change this if you want to avoid conflicts
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));