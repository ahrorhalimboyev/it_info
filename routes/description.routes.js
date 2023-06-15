const { Router } = require("express");
const router = Router();
const {
  addDescription,
  getDescriptions,
} = require("../controllers/description.controller");
const adminRolesPolice = require("../middleware/adminRolesPolice");

router.get("/", getDescriptions);
router.post(
  "/",
  adminRolesPolice(["READ", "WRITE", "CHANGE", "DELETE"]),
  addDescription
);

module.exports = router;
