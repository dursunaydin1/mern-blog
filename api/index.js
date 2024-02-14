import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

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

app.listen(3000, () => {
  console.log("API sunucusu 3000 numaralı bağlantı noktasında çalışıyor...");
});
