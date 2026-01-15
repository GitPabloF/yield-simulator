const express = require("express")
const simulationRoutes = require("./simulation.routes")

const router = express.Router()

router.use('/simulation', simulationRoutes)

module.exports = router