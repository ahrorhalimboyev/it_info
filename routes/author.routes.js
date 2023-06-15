const { Router } = require("express");
const router = Router();
const {
  addAuthor,
  getAllAuthors,
  deleteAuthor,
  // updateAuthor,
  getAuthorById,
  getAuthorByName,
  loginAuthor,
} = require("../controllers/author.controller");
const authorPolice = require("../middleware/authorPolice");
const authorRolesPolice = require("../middleware/authorRolesPolice");

router.post("/", addAuthor);
router.get("/", authorPolice, getAllAuthors);
router.get(
  "/:id",
  authorRolesPolice(["READ", "WRITE", "CHANGE", "DELETE"]),
  getAuthorById
);
router.get("/author/:author_first_name", getAuthorByName);
router.delete("/:id", deleteAuthor);
router.post("/login", loginAuthor);
// router.put("/:id", updateAuthor);

module.exports = router;
