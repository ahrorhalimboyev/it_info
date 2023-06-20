const bcrypt = require("bcrypt");
const { errorHandler } = require("../helpers/error_handler");
const { userValidation } = require("../validations/user.validations");
const User = require("../models/user");
const config = require("config");
const myJwt = require("../services/JwtService");
const uuid = require("uuid");
const MailService = require("../services/MailService");

exports.addUser = async (req, res) => {
  // try {
  //   const { error, value } = userValidation(req.body);
  //   if (error) {
  //     return res.status(400).send({ message: error.details[0].message });
  //   }
  const {
    user_name,
    user_email,
    user_password,
    user_info,
    user_photo,
    user_is_active,
  } = req.body;
  const user = await User.findOne({ user_email });
  if (user) {
    return res.status(400).send({ message: "User exists" });
  }

  const hashedPassword = await bcrypt.hash(user_password, 8);
  const user_activation_link = uuid.v4();

  const newUser = await User({
    user_name,
    user_email,
    user_password: hashedPassword,
    user_info,
    user_photo,
    user_is_active,
    user_activation_link,
  });
  await newUser.save();
  await MailService.sendActivationMail(
    user_email,
    `${config.get("api_url")}/api/user/activate/${user_activation_link}`
  );

  const payload = {
    id: newUser._id,
    is_active: newUser.is_active,
    authorRoles: ["READ"],
  };

  const tokens = myJwt.generateTokens(payload);
  newUser.user_token = tokens.refreshToken;
  await newUser.save();

  res.cookie("refreshToken", tokens.refreshToken, {
    maxAge: config.get("refresh_ms"),
    httpOnly: true,
    secure: true,
  });

  res.status(200).send({ ...tokens, user: payload });

  // } catch (error) {
  //   errorHandler(res, error);
  // }
};

exports.userActivate = async (req, res) => {
  try {
    const user = await User.findOne({
      user_activation_link: req.params.link,
    });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }
    if (user.user_is_active) {
      return res.status(400).send({ message: "User already activated" });
    }
    user.user_is_active = true;
    await user.save();
    res.status(200).send({
      user_is_active: user.user_is_active,
      message: "User activated",
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length < 1) {
      return res.status(400).send({ message: "Users not found" });
    }
    res.json(users);
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.updateUser = async (req, res) => {
  // try {
  //   const { error, value } = userValidation(req.body);
  //   if (error) {
  //     return res.status(400).send({ message: error.details[0].message });
  //   }
  const {
    user_name,
    user_email,
    user_password,
    user_info,
    user_photo,
    user_is_active,
  } = req.body;
  const hashedPassword = await bcrypt.hash(user_password, 8);
  const updatedUser = await User.updateOne(
    { _id: req.params.id },
    {
      $set: {
        user_name,
        user_email,
        user_password: hashedPassword,
        user_info,
        user_photo,
        user_is_active,
      },
    }
  );
  if (updatedUser.acknowledged) {
    res.status(200).send({ message: "User updated" });
  } else {
    res.status(400).send({ message: "User is not updated" });
  }
  // } catch (error) {
  //   errorHandler(res, error);
  // }
};

exports.loginUser = async (req, res) => {
  try {
    const { user_email, user_password } = req.body;
    const user = await User.findOne({ user_email });
    if (!user) {
      return res
        .status(400)
        .send({ message: "Email or password is incorrect" });
    }
    const validPassword = await bcrypt.compare(
      user_password,
      user.user_password
    );
    if (!validPassword) {
      return res
        .status(400)
        .send({ message: "Email or password is incorrect" });
    }
    const payload = {
      id: user._id,
      is_active: user.user_is_active,
      userRoles: ["READ"],
    };
    const tokens = myJwt.generateTokens(payload);
    console.log(tokens);

    user.user_token = tokens.refreshToken;
    await user.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });

    res.status(200).send({ ...tokens });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }
    const deletedUser = await User.deleteOne({ _id: req.params.id });
    if (deletedUser.acknowledged) {
      res.status(200).send({ message: "User deleted" });
    } else {
      res.status(200).send({ message: "User is not deleted" });
    }
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.logoutUser = async (req, res) => {
  const { refreshToken } = req.cookies;
  let admin;
  if (!refreshToken)
    return res.status(400).send({ message: "Token is not found" });
  admin = await User.findOneAndUpdate(
    { user_token: refreshToken },
    { user_token: "" },
    { new: true }
  );
  if (!user) return res.status(400).send({ message: "Token is not found" });

  res.clearCookie("refreshToken");
  res.status(200).send({ user });
};
