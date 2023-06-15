const { Router } = require("express");
const router = Router();
const {
  addTerm,
  getTerms,
  getTermsByLetter,
  getTermById,
  getTermsByTerm,
  updateTermById,
  deleteTermById,
} = require("../controllers/dictionary.controller");
const adminRolesPolice = require("../middleware/adminRolesPolice");

router.post("/", addTerm);
router.get("/", getTerms);
router.get("/letter/:letter", getTermsByLetter);
router.get(
  "/:id",
  adminRolesPolice(["READ", "WRITE", "CHANGE", "DELETE"]),
  getTermById
);
router.get("/term/:term", getTermsByTerm);
router.put(
  "/:id",
  adminRolesPolice(["READ", "WRITE", "CHANGE", "DELETE"]),
  updateTermById
);
router.delete(
  "/:id",
  adminRolesPolice(["READ", "WRITE", "CHANGE", "DELETE"]),
  deleteTermById
);

module.exports = router;
