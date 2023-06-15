const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  if (req.method == "OPTIONS") {
    next();
  }
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(403).json({ message: "Author is not authorized" });
    }

    console.log(authorization);
    const bearer = authorization.split(" ")[0];
    const token = authorization.split(" ")[1];

    if (bearer != "Bearer" || !token) {
      return res
        .status(403)
        .json({ message: "Author is not authorized (Token is not given)" });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(403).send({ message: "Token is wrong" });
  }
};
