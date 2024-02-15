import User from "../models/user.model.js";
import bcrypts from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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

// giris yapmak için kullanıcı adı, email, parola bilgilerini alıyoruz.
// parolayı hash ediyoruz.
// token oluşturuyoruz.
// cookie oluşturuyoruz.
// kullanıcı bilgilerini veri tabanına kaydediyoruz.

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email == "" || password == "") {
    next(errorHandler(400, "Lütfen bilgileri eksiksiz doldurunuz."));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "Kullanıcı bulunamadı."));
    }
    const validPassword = bcrypts.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Hatalı parola."));
    }
    const token = jwt.sign(
      {
        id: validUser._id,
      },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
