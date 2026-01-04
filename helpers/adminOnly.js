const jwt = require("jsonwebtoken");
const adminOnly = (req, res, next) => {
  const token = req.cookies.token;
  const decodedToken = jwt.decode(token);
  console.log(decodedToken);
  if (!decodedToken.isAdmin)
    return res.status(403).json({
      status: "fail",
      message: "admin only use this route",
    });
  next();
};

module.exports = adminOnly;
