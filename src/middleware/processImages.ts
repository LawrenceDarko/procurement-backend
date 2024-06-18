import path from "path";
import multer from "multer";

const limits = {
  fileSize: 4 * 1024 * 1024, // Limit file size to 4MB
};
const fileFilter = (req: any, file: any, cb: any) => {
    // Check if the uploaded file is an image
    if (file.mimetype.startsWith("image/")) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error("Only image files are allowed.")); // Reject the file
    }
};

// Set up Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = path.join(process.cwd(), "uploads");
        cb(null, destinationPath); // Specify the directory where you want to save the files
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const fileName = file.originalname.replace(ext, "");
        cb(null, `${fileName}-${Date.now()}${ext}`);
    },
});

// Create the multer middleware
const upload = multer({ storage, limits, fileFilter });

const processImage = (fileInputName: string) => {
    return upload.single(fileInputName);
};

export default processImage;