const router = require('express').Router()
const auth = require("../config/auth")

const userController = require("../controllers/userController")

router.route('/register').post((req, res) => userController.create(req, res))

router.route('/searchall').get(auth, (req, res) => userController.getAll(req, res))

router.route('/searchuser/:id').get(auth, (req, res) => userController.getOne(req, res))

router.route('/deleteuser/:id').delete(auth, (req, res) => userController.delete(req, res))

router.route('/updateduser/:id').put(auth, (req, res) => userController.update(req, res))

router.route('/updatepassword/:id').put(auth, (req, res) => userController.updatePassword(req, res))

router.route('/includegroup/:id').put(auth, (req, res) => userController.includeGroup(req, res))

module.exports = router