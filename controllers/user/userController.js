const User = require("../../models/userSchema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { client } = require("../../redis.js");
//const { verifyRefresh } = require("../../middlewares/verifyToken");

// verify refresh token
const verifyRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    return res.status(401).json({
      message: "User Not Authenticated",
    });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_KEY || "secret");
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(401).json({
        message: "User Not found",
      });
    }
    const accessToken = jwt.sign(
      {
        email: user.email,
        userId: user._id,
      },
      process.env.JWT_KEY || "secret",
      {
        expiresIn: "1m",
      }
    );
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.status(200).json({
      message: "Refresh Token Verified",
    });
  } catch (err) {
    return res.status(401).json({
      message: "Auth failed",
      error: err,
    });
  }

  /*user.tokens = user.tokens.filter((token) => token.token !== refreshToken);
    user.tokens.push({ token, type: "access" });
    user.tokens.push({ token: refreshToken, type: "refresh" });
    await user.save();
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      maxAge: 3600000,
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 604800000,
    });*/
};

// Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users) {
      res.status(200).json({
        message: "success",
        data: users,
      });
    } else {
      res.status(404).json({
        message: "No users found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "error in fetching users",
      message: err,
    });
  }
};

// Add User
const addUser = async (req, res) => {
  let data = { ...req.body };
  if (!(data.email && data.password && data.location)) {
    res.status(400).json({ message: "All inputs are required" });
  } else {
    try {
      let user = await User.find({ email: data.email });
      if (user.length > 0) {
        res.status(400).json({ message: "User already exists" });
      } else {
        data.password = await bcrypt.hash(data.password, 10);
        let newUser = await User.create(data);
        res
          .status(200)
          .json({ message: "User Registered Successfully", newUser });
      }
    } catch (err) {
      res.status(500).json({ message: "Error", err });
    }
  }
};

//update user
const updateUser = async (req, res) => {
  let data = { ...req.body };
  try {
    let userUpdate = await User.findByIdAndUpdate(
      { _id: req.params.id },
      data,
      { new: true }
    );
    return userUpdate;
  } catch (err) {
    res.status(500).json({ message: "Error in updating", err });
  }
};

// login user
const loginUser = async (req, res) => {
  let data = { ...req.body };
  if (!(data.email && data.password && data.confirmPassword)) {
    res.status(400).json({ message: "All inputs are required" });
  } else if (data.password !== data.confirmPassword) {
    res.status(400).json({ message: "Passwords do not match" });
  } else {
    try {
      let user = await User.find({ email: data.email });
      if (user.length > 0) {
        let isMatch = await bcrypt.compare(data.password, user[0].password);
        if (isMatch) {
          const accessToken = jwt.sign(
            {
              email: user[0].email,
              userId: user[0].id,
            },
            process.env.JWT_KEY || "secret",
            {
              expiresIn: "1m",
            }
          );
          const refreshToken = jwt.sign(
            {
              email: user[0].email,
              userId: user[0].id,
            },
            process.env.REFRESH_TOKEN_KEY || "secret",
            {
              expiresIn: "7d",
            }
          );
          res.cookie("access_token", accessToken, {
            httpOnly: true,
            maxAge: 2.592e9,
          });
          res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            maxAge: 2.592e9,
          });
          user[0].tokens.push({ token: accessToken });
          await user[0].save();

          res.status(200).json({
            message: "User logged in",
            user,
            accessToken,
            refreshToken,
          });
        } else {
          res.status(400).json({ message: "Invalid credentials" });
        }
      } else {
        res.status(400).json({ message: "User does not exist" });
      }
    } catch (err) {
      res.status(500).json({ message: "Error", err });
    }
  }
};

// Get users in radius of 5km
const getUsersInRadius = async (req, res) => {
  let data = req.body;
  let lat = data.lat;
  let lng = data.lng;
  let users = await User.find();
  if (!users) {
    res.status(404).json({
      message: "No users found",
    });
  }
  let usersInRadius = users.filter((user) => {
    let userLat = user.location.lat;
    let userLng = user.location.lng;
    let distance = calcDist(lat, lng, userLat, userLng).toFixed(1);
    console.log("distance = ", distance);
    if (distance <= 5) {
      return user;
    }
  });
  if (usersInRadius.length > 0) {
    res.status(200).json({
      message: "success",
      data: usersInRadius,
    });
  } else {
    res.status(404).json({
      message: "No users in 5KM radius found",
    });
  }
};

// calculate radius
function calcDist(lat1, lon1, lat2, lon2) {
  var R = 6371; // km
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value) {
  return (Value * Math.PI) / 180;
}

// logout user
const logoutUser = async (req, res) => {
  try {
    let user = await User.updateMany(
      { _id: req.user.userId },
      {
        $pull: { tokens: { token: req.cookies.access_token } },
      }
    );
    if (user) {
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      res.status(200).json({
        message: "User logged out",
      });
    } else {
      res.status(500).json({
        message: "Error in logging out",
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Error", err });
  }
};

module.exports = {
  getUsers,
  addUser,
  getUsersInRadius,
  loginUser,
  logoutUser,
  verifyRefreshToken,
};
