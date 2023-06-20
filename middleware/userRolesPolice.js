const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method == "OPTIONS") {
      next();
    }
    try {
      const authorization = req.headers.authorization;
      if (!authorization) {
        return res.status(403).json({ message: "User is not authorized" });
      }

      const bearer = authorization.split(" ")[0];
      const token = authorization.split(" ")[1];

      if (bearer != "Bearer" || !token) {
        return res
          .status(403)
          .json({ message: "User is not authorized (Token is not given)" });
      }

      const { is_active, userRoles } = jwt.verify(token, config.get("secret"));
      console.log(is_active, userRoles);
      let hasRole = false;
      userRoles.forEach((userRole) => {
        if (roles.includes(userRole)) hasRole = true;
      });

      if (!is_active || !hasRole) {
        return res.status(403).send({ message: "You are not allowed" });
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(403).send({ message: "Token is wrong" });
    }
  };
};
