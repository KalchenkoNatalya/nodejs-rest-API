import multer from "multer";
import path from "path";

const destination = path.resolve("temp");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const uniqPreffix = `${Date.now()}_${Math.random() * 1e9}`;
    const filename = `${uniqPreffix}_${file.originalname}`;
    cb(null, filename);
  },
});

const limits = { fileSize: 2000 * 2000 * 20 };

const upload = multer({ storage, limits });

export default upload;
