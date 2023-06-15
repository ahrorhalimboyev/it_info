const { Router } = require("express");
const router = Router();

const dictionaryRouter = require("./dictionary.routes");
router.use("/api/term", dictionaryRouter);

const categoryRouter = require("./category.routes");
router.use("/api/category", categoryRouter);

const descRouter = require("./description.routes");
router.use("/api/description", descRouter);

const authorRouter = require("./author.routes");
router.use("/api/author", authorRouter);

const adminRouter = require("./admin.routes");
router.use("/api/admin", adminRouter);

const userRouter = require("./user.routes");
router.use("/api/user", userRouter);

module.exports = router;
