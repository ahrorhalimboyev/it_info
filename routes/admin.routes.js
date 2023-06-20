const Router = require("express");
const {
  addAdmin,
  getAllAdmins,
  updateAdmin,
  loginAdmin,
  deleteAdmin,
  logoutAdmin,
} = require("../controllers/admin.controller");
const router = Router();
const adminRolesPolice = require("../middleware/adminRolesPolice");
const adminPolice = require("../middleware/adminPolice");
const Validator = require("../middleware/validator");

router.post("/", Validator("admin"), addAdmin);
router.get("/", adminPolice, getAllAdmins);
router.put(
  "/:id",
  adminRolesPolice(["READ", "WRITE", "CHANGE", "DELETE"]),
  updateAdmin
);
router.post("/login", loginAdmin);
router.delete(
  "/:id",
  adminRolesPolice(["READ", "WRITE", "CHANGE", "DELETE"]),
  deleteAdmin
);
router.post("/logout", logoutAdmin);

module.exports = router;
