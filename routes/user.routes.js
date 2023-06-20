const { Router } = require("express");
const {
  addUser,
  getAllUsers,
  updateUser,
  loginUser,
  deleteUser,
  logoutUser,
  userActivate,
} = require("../controllers/user.controller");
const userRolesPolice = require("../middleware/userRolesPolice");
const router = Router();

router.post("/", addUser);
router.get("/", userRolesPolice(["READ"]), getAllUsers);
router.put("/:id", updateUser);
router.post("/login", loginUser);
router.delete("/:id", deleteUser);
router.post("/logout", logoutUser);
router.get("/activate/:link", userActivate);

module.exports = router;
