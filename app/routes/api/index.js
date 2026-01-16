const express = require("express")
const simulationRoutes = require("./simulation.routes")
const adminRoutes = require("./admin.routes")

const router = express.Router()

router.use('/simulation', simulationRoutes)
router.use('/admin', adminRoutes)

module.exports = router