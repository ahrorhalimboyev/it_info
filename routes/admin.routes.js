const Router = require("express");
const {
  addAdmin,
  getAllAdmins,
  updateAdmin,
  loginAdmin,
  deleteAdmin,
} = require("../controllers/admin.controller");
const router = Router();
const adminRolesPolice = require("../middleware/adminRolesPolice");

router.post("/", addAdmin);
router.get("/", getAllAdmins);
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

module.exports = router;
