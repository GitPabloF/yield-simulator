const express = require("express")
const simulationRoutes = require("./simulation.routes")

const router = express.Router()

router.use('/simulations', simulationRoutes)

module.exports = router