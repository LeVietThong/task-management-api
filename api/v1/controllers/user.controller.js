const User = require("../models/user.model");
const md5 = require("md5");

//[POST] api/v1/users/register
module.exports.register = async (req, res) => {
  // const existEmail = await User.findOne({ email: req.body.email });

  // req.body.password = md5(req.body.password);

  // const user = new User(req.body);
  // await user.save();

  res.json({
    code: 200,
    message: "Tạo user thành công",
  });
};
