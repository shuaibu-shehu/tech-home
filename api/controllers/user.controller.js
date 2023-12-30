const bcrypt = require("bcrypt");
const User = require("../models/user.model.js");
const { handleError } = require("../utils/error.js");

const updateProfile = async (req, res, next) => {
  
  if (req.verifiedUser.id !== req.params.id)
    return next(handleError(403, "You can only update your own account"));
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set:{ 
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            avatar:req.body.avatar,
        } 
      },
      { new: true }
    );
    const { password, ...user } = updatedUser._doc;
    res.status(200).json(user);
  } catch (error) { 
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  if (req.verifiedUser.id !== req.params.id)
    return next(handleError(403, "You can only delete your own account"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
}

module.exports = { updateProfile , deleteUser};