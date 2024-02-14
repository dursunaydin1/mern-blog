import User from "../models/user.model.js";
import bcrypts from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  //  body deki bilgileri alıyoruz.
  const { username, email, password } = req.body;
  // giriş kontrolu yapılıyor ...
  if (
    !username ||
    !email ||
    !password ||
    username == "" ||
    email == "" ||
    password == ""
  ) {
    next(errorHandler(400, "Lütfen bilgileri eksiksiz doldurunuz."));
  }

  //   parolayı hash ediyoruz.
  const hashedPassword = bcrypts.hashSync(password, 10);

  //   yeni bir kullanıcı oluşturmak için kullanıcı adı, email, parola bilgilerini alıyoruz.
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  //   yeni bir kullanıcı oluşturuyoruz.

  try {
    await newUser.save();
    res.json("Kullanıcı oluşturuldu.");
  } catch (err) {
    next(err);
  }
};
