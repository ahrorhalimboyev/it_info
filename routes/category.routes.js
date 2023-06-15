const { Router } = require("express");
const router = Router();
const {
  addCategory,
  getAllCatergories,
  deleteCategory,
  updateCategory,
  getCategoryById,
  getCategoryByName,
} = require("../controllers/category.controller");
const adminRolesPolice = require("../middleware/adminRolesPolice");

router.get("/", getAllCatergories);
router.get("/:id", getCategoryById);
router.get("/category/:category_name", getCategoryByName);
router.post("/", addCategory);
router.delete(
  "/:id",
  adminRolesPolice(["READ", "WRITE", "CHANGE", "DELETE"]),
  deleteCategory
);
router.put(
  "/:id",
  adminRolesPolice(["READ", "WRITE", "CHANGE", "DELETE"]),
  updateCategory
);

module.exports = router;
