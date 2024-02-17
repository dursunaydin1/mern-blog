import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL || "mongodb://localhost:27017/mern-blog")
  .then(() => {
    console.log("MongoDB bağlantısı başarıyla sağlandı...");
  })
  .catch((err) => {
    console.error("MongoDB bağlantısı sağlanırken bir hata oluştu:", err);
  });

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("API sunucusu 3000 numaralı bağlantı noktasında çalışıyor...");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

//   hata yakalama
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Bir hata oluştu";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
