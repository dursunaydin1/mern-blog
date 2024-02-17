import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

// Kullanıcı bilgilerini dogrulamak için kullanılan fonksiyon
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "Hatalı token"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Hatalı token"));
    }
    req.user = user;
    next();
  });
};
