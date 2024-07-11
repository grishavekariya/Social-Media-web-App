const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const multer = require("multer");
const path = require("path");
const cors = require('cors');

dotenv.config();

const port = process.env.PORT || 8800;

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users" ,userRoute);
app.use("/api/auth" ,authRoute);
app.use("/api/posts" ,postRoute);

app.use("/images", express.static(path.join(__dirname, "public/images")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

async function connectDB() {
    try {
      await mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
        tls: true,
        tlsAllowInvalidCertificates: false,
        tlsAllowInvalidHostnames: false
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Could not connect to MongoDB', error);
      process.exit(1);
    }
  }
  
  connectDB();
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });