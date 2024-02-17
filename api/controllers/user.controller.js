import bcrypts from "bcryptjs";
import User from "../models/user.model";

export const test = (req, res) => {
  res.json({ message: "API test ediliyor..." });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "Bu kullanıcıyı düzenleme yetkiniz yok"));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Parola en az 6 karakter olmalıdır"));
    }
    req.body.password = bcrypts.hashSync(req.body.password, 10);
  }
  if (req.body.username.length < 7 || req.body.username.length > 20) {
    return next(
      errorHandler(400, "Kullanıcı adı 7 ile 20 karakter arasında olmalıdır")
    );
  }
  if (req.body.username.includes(" ")) {
    return next(errorHandler(400, "Kullanıcı adı boşluk içermemelidir"));
  }
  if (req.body.username !== req.body.username.toLowerCase()) {
    return next(errorHandler(400, "Kullanıcı adı büyük harfle başlamalıdır"));
  }
  if (req.body.username.match(/[a-zA-Z0-9]+$/)) {
    return next(errorHandler(400, "Kullanıcı adı rakamla bitmeyebilir"));
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      {
        new: true,
      }
    );
    const { password: pass, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
