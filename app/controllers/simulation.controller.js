const { createSimulation } = require("../services/simulation.service")

/**
 * Create a new simulation
 * @param {express.Request} req
 * @param {express.Response} res
 */
const createSimulationController = async (req, res) => {
    try {
        const {
            purchasePrice,
            monthlyRent,
            annualRentalFee,
            prospectEmail,
            managementCommissionYear1,
            managementCommissionYear2,
            managementCommissionYear3Plus,
            surface,
            bedrooms,
            locationScore,
        } = req.body

        // basic required validation
        if (!prospectEmail) {
            return res.status(400).json({ message: "Email is required" })
        }

        const purchasePriceNum = Number(purchasePrice)
        const monthlyRentNum = Number(monthlyRent)
        const annualRentalFeeNum = Number(annualRentalFee)

        if (isNaN(purchasePriceNum) || purchasePriceNum <= 0) {
            return res
                .status(400)
                .json({ message: "Purchase price must be greater than zero" })
        }

        if (isNaN(monthlyRentNum) || monthlyRentNum < 0) {
            return res
                .status(400)
                .json({ message: "Monthly rent cannot be negative" })
        }

        if (isNaN(annualRentalFeeNum) || annualRentalFeeNum < 0) {
            return res
                .status(400)
                .json({ message: "Annual rental fee cannot be negative" })
        }

        const params = {
            purchasePrice: purchasePriceNum,
            monthlyRent: monthlyRentNum,
            annualRentalFee: annualRentalFeeNum,
            prospectEmail,
        }

        // when the commission is provided, it must be a number between 0 and 1
        if (
            managementCommissionYear1 !== undefined &&
            managementCommissionYear1 !== ""
        ) {
            const value = Number(managementCommissionYear1)
            if (isNaN(value) || value < 0 || value > 1) {
                return res
                    .status(400)
                    .json({ message: "Invalid management commission year 1" })
            }
            params.managementCommissionYear1 = value
        }

        if (
            managementCommissionYear2 !== undefined &&
            managementCommissionYear2 !== ""
        ) {
            const value = Number(managementCommissionYear2)
            if (isNaN(value) || value < 0 || value > 1) {
                return res
                    .status(400)
                    .json({ message: "Invalid management commission year 2" })
            }
            params.managementCommissionYear2 = value
        }

        if (
            managementCommissionYear3Plus !== undefined &&
            managementCommissionYear3Plus !== ""
        ) {
            const value = Number(managementCommissionYear3Plus)
            if (isNaN(value) || value < 0 || value > 1) {
                return res
                    .status(400)
                    .json({ message: "Invalid management commission year 3 plus" })
            }
            params.managementCommissionYear3Plus = value
        }

        // Data-driven fields if provided
        if (surface !== undefined && surface !== "") {
            params.surface = Number(surface)
        }
        if (bedrooms !== undefined && bedrooms !== "") {
            params.bedrooms = Number(bedrooms)
        }
        if (locationScore !== undefined && locationScore !== "") {
            params.locationScore = Number(locationScore)
        }

        // Create the simulation static and predicted
        const result = await createSimulation(params)

        return res.status(201).json({
            message: "Simulation created successfully",
            data: {
                static: result.static,
                predicted: result.predicted,
                predictionMetadata: result.predictionMetadata,
            },
        })
    } catch (error) {
        console.error("Error creating simulation:", error)
        return res.status(500).json({ message: "Failed to create simulation" })
    }
}

module.exports = {
    createSimulationController,
}
