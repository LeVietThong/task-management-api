const User = require("../models/user.model");
const ForgotPassword = require("../models/forgot-password.model");
const md5 = require("md5");

const generateHelper = require("../../../helpers/generate");
const sendEmailHelper = require("../../../helpers/sendMail");

//[POST] api/v1/users/register
module.exports.register = async (req, res) => {
  req.body.password = md5(req.body.password);

  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });

  if (existEmail) {
    return res.json({
      code: 400,
      message: "Email đã tồn tại",
    });
  } else {
    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
    });

    await user.save();

    const token = user.token;
    res.cookie("token", token);

    res.json({
      code: 200,
      message: "Tạo tài khoản thành công",
      token: token,
    });
  }
};

//[POST] api/v1/users/login
module.exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    res.json({
      code: 400,
      message: "Email không tồn tại",
    });
    return;
  }

  if (user.password != md5(password)) {
    res.json({
      code: 400,
      message: "Sai mật khẩu",
    });
    return;
  }

  const token = user.token;
  res.cookie("token", token);

  res.json({
    code: 200,
    message: "Đăng nhập thành công",
    token: token,
  });
};

//[POST] api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
  const email = req.body.email;
  
  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    res.json({
      code: 400,
      message: "Email không tồn tại",
    });
    return;
  }

  const otp = generateHelper.generateRandomNumber(6);
  
  const timeExpire = Date.now();
  
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: timeExpire,
  }

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  //Gửi OTP qua mail user
  const subject = "Mã OTP lấy lại mật khẩu.";
  const html = `Mã OTP của bạn để lấy lại mật khẩu là <b>${otp}</b>`;
  await sendEmailHelper.sendEmail(email, subject, html);

  res.json({
    code: 200,
    message: "Gửi mã OTP thành công",
  });
};
