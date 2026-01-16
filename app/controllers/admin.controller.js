const Simulation = require("../models/Simulation")

/**
 * @description Get all simulations
 * @param {Object} req
 * @param {Object} res
 * @returns {Object}
 */
const getAllSimulationsController = async (req, res) => {
    try {
        const simulations = await Simulation.find()
            .sort({ createdAt: -1 })
            .lean()
        return res.status(200).json({ success: true, data: simulations })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = {
    getAllSimulationsController
}