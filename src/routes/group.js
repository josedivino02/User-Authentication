const router = require("express").Router()
const auth = require("../config/auth")

const groupController = require("../controllers/groupController")

router.route('/register').post(auth, (req, res) => groupController.create(req, res))

router.route('/searchall').get(auth, (req, res) => groupController.getAll(req, res))

router.route('/deletegroup/:id').delete(auth, (req, res) => groupController.delete(req, res))

router.route('/updategroup/:id').put(auth, (req, res) => groupController.update(req, res))

module.exports = router