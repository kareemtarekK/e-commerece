const { expressjwt } = require("express-jwt");
const dotenv = require("dotenv");
const User = require("./../models/user");
dotenv.config({ path: "./.env" });

const API = process.env.API;

exports.authJwt = () => {
  return expressjwt({
    algorithms: ["HS256"],
    secret: process.env.SECRET,
    // isRevoked: isRevoked,
    getToken: getToken,
  }).unless({
    path: [
      `${API}/users/login`,
      { url: `${API}/users`, methods: ["POST", "OPTIONS"] },
      { url: /^\/api\/v1\/products.*/, methods: ["GET", "OPTIONS"] },
      { url: /^\/api\/v1\/categories.*/, methods: ["GET", "OPTIONS"] },
      { url: /^\/api\/v1\/users\/get\/count/, methods: ["GET", "OPIONS"] },
      { url: /^\/public\/uploads\//, methods: ["GET", "OPTIONS"] },
    ],
  });
};

const isRevoked = async (req, token) => {
  const id = token.payload.id;
  //   console.log(token.payload.isAdmin);
  const user = await User.findById(id);
  req.user = user;
  //   if (!user.isAdmin) return true;
  if (!token.payload.isAdmin) return true;
};

const getToken = (req) => {
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
};
