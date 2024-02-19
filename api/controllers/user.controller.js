import bcrypts from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
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

// Delete User
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "Bu kullanıcıyı silme yetkiniz yok"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("Kullanıcı silindi");
  } catch (error) {
    next(error);
  }
};

// Cikis yap
export const signout = async (req, res, next) => {
  try {
    res
      .status(200)
      .cookie("access_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .json("Cikis yapildi");
  } catch (error) {
    next(error);
  }
};

// Kullanıcı bilgilerini getir
export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(
      errorHandler(403, "Bu kullanıcı bilgilerini getirme yetkiniz yok")
    );
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    const users = await User.find({})
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const userWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments({});

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: userWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};
