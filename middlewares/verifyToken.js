const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const accessToken = req.cookies.access_token;
  if (!accessToken) {
    return res.status(401).json({
      message: "User Not Authenticated",
    });
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_KEY || "secret");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Auth failed",
      error: err,
    });
  }
};

const verifyRefresh = (req, res, next) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    return res.status(401).json({
      message: "User Not Authenticated",
    });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_KEY || "secret");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Auth failed",
      error: err,
    });
  }
};

module.exports = { verifyToken, verifyRefresh };
