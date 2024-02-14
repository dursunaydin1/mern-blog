import User from "../models/user.model.js";
import bcrypts from "bcryptjs";

export const signup = async (req, res) => {
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
    return res.status(400).json({ message: "Tüm alanları doldurunuz." });
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
    res.status(500).json({ message: err.message });
  }
};
