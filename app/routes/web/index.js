const express = require("express")
const router = express.Router()

const simulationRoutes = require("./simulation.routes")

router.use("/", simulationRoutes)

module.exports = router