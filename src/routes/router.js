const router = require("express").Router();

//rotas
const userRouter = require("./user")
const groupRouter = require("./group")
const loginRouter = require("./login")

router.use("/user", userRouter)
router.use("/group", groupRouter)
router.use("/login", loginRouter)

module.exports = router;