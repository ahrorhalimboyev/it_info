const jwt = require("jsonwebtoken");
const config = require("config");
const authorPolice = require("./authorPolice");

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method == "OPTIONS") {
      next();
    }
    try {
      const authorization = req.headers.authorization;
      if (!authorization) {
        return res.status(403).json({ message: "Author is not authorized" });
      }

      const bearer = authorization.split(" ")[0];
      const token = authorization.split(" ")[1];

      if (bearer != "Bearer" || !token) {
        return res
          .status(403)
          .json({ message: "Author is not authorized (Token is not given)" });
      }

      const { is_expert, authorRoles } = jwt.verify(
        token,
        config.get("secret")
      );
      console.log(is_expert, authorRoles);
      let hasRole = false;
      authorRoles.forEach((authorRole) => {
        if (roles.includes(authorRole)) hasRole = true;
      });

      if (!is_expert || !hasRole) {
        return res.status(403).send({ message: "You are not allowed" });
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(403).send({ message: "Token is wrong" });
    }
  };
};
