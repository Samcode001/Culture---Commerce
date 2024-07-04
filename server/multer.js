import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqeSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.originalname.split(".")[0] +
        "-" +
        uniqeSuffix +
        file.originalname.slice(file.originalname.lastIndexOf("."))
    );
  },
});

const upload = multer({ storage: storage });
export { upload };
