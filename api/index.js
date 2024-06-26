const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/user.route.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth.route.js");
const listingRouter = require("./routes/listing.route.js");
const app = express();
const path = require('path');

dotenv.config();
try {
  mongoose.connect("mongodb+srv://kalifa:kalifa@cluster0.ajugxhp.mongodb.net/?retryWrites=true&w=majority");
} catch (error) {
  console.log(error);
}
const _dirname = path.resolve();
// app.use(express.urlencod/=ed({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing",listingRouter)

app.use(express.static(path.join(_dirname, "/client/dist")));

app.get('*', (req, res) => {
  res.sendFile(path.join(_dirname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  return res.status(statusCode).json({ 
    success: false, 
    statusCode,
    message,
  });
});

mongoose.connection.once("open", () => {
  console.log("DB connected");
  app.listen(3000, () => {
    console.log("Server on port 3000");
  });
});
