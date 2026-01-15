const express = require("express")
const { createSimulationController } = require("../../controllers/simulation.controller")
const router = express.Router()


router.post('/', createSimulationController)

module.exports = router