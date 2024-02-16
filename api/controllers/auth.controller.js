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

  //   yeni bir kullanıcı oluşturuyoruz.
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    //   veri tabanına kaydediyoruz.
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
    //   veri tabanından kullanıcıyı buluyoruz.
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "Kullanıcı bulunamadı."));
    }
    //   parolayı hash ediyoruz.
    const validPassword = bcrypts.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Hatalı parola."));
    }
    //   token oluşturuyoruz.
    const token = jwt.sign(
      {
        id: validUser._id,
      },
      process.env.JWT_SECRET
    );

    //   cookie oluşturuyoruz.
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

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    //   veri tabanında kullanıcıyı buluyoruz.
    const user = await User.findOne({ email });
    if (user) {
      //   token oluşturuyoruz.
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET
      );
      const { password: pass, ...rest } = user._doc;
      // Kullanıcı bilgilerini dön ve cookie'ye tokeni ekliyoruz.
      res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    } else {
      // kullanıcı bulunamazsa yeni bir kullanıcı oluşturuyoruz.
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const handlePassword = bcrypts.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: handlePassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      // Yeni kullanıcı için JWT ile token oluşturuyoruz.
      const token = jwt.sign(
        {
          id: newUser._id,
        },
        process.env.JWT_SECRET
      );
      const { password: pass, ...rest } = newUser._doc;
      // Kullanıcı bilgilerini dön ve cookie'ye tokeni ekle
      res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
