const { Router } = require("express");
const {
    addUser,
    getAllUsers,
    updateUser,
    loginUser,
    deleteUser,
} = require("../controllers/user.controller");
const router = Router();

router.post("/", addUser);
router.get("/", getAllUsers);
router.put("/:id", updateUser);
router.post("/login", loginUser);
router.delete("/:id", deleteUser);

module.exports = router;
