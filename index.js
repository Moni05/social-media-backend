const express = require("express");
const app = express();
const UserRouter = require("./routes/users.route");
const authRouter = require("./routes/auth.route");
const postRouter = require("./routes/posts.route");
const path = require("path");
const cors = require("cors");
const multer = require("multer");

app.use("/images", express.static(path.join(__dirname, "public/images")));


app.use(express.json());
app.use(cors());
const db = require("./mongoose");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });
  
  const upload = multer({ storage: storage });
  app.post("/upload", upload.single("file"), (req, res) => {
    try {
      return res.status(200).json("File uploded successfully");
    } catch (error) {
      console.error(error);
    }
});

app.use("/user", UserRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);
 
app.listen(process.env.PORT || 3001
, ()=>console.log("Server running"));
