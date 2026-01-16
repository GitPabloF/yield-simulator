const express = require("express")
const router = express.Router()

const simulationRoutes = require("./simulation.routes")
const adminRoutes = require("./admin.routes")

router.use("/", simulationRoutes)
router.use("/admin", adminRoutes)

module.exports = router