const express = require("express")
const router = express.Router()

const adminController = require("../../controllers/admin.controller")

router.get("/simulations", adminController.getAllSimulationsController)

module.exports = router