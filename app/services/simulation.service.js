const Simulation = require("../models/Simulation")
const { calculateYield } = require("./yield.service")
const { getOccupancyPrediction } = require("./prediction.service")

/**
 * Create a new simulation
 * @param {Object} params 
 * @returns {Promise<Object>}
 */
const createSimulation = async ({
  purchasePrice,
  monthlyRent,
  annualRentalFee,
  prospectEmail,
  surface,
  bedrooms,
  locationScore,
  managementCommissionYear1 = 0.3,
  managementCommissionYear2 = 0.25,
  managementCommissionYear3Plus = 0.2,
}) => {

  // Calculate static yield with 100% occupancy
  const staticResult = calculateYield({
    purchasePrice,
    monthlyRent,
    annualRentalFee,
    managementCommissionYear1,
    managementCommissionYear2,
    managementCommissionYear3Plus,
    occupancyRate: 1.0,
  })

  // Prepare response
  const response = {
    static: staticResult,
    predicted: null,
    predictionMetadata: null,
  }

  // if data-driven  provided
  if (surface && bedrooms && locationScore) {
    // call the prediction service to calculate the prediction data
    const prediction = getOccupancyPrediction({ surface, bedrooms, locationScore })

    if (prediction) {
      const occupancyRate = prediction.occupancyRate / 100

      // Calculate the yeld  with the predicted occupancy rate
      const predictedResult = calculateYield({
        purchasePrice,
        monthlyRent,
        annualRentalFee,
        managementCommissionYear1,
        managementCommissionYear2,
        managementCommissionYear3Plus,
        occupancyRate,
      })

      response.predicted = predictedResult
      response.predictionMetadata = prediction
    }
  }

  // save to DB
  const simulation = new Simulation({
    purchasePrice,
    monthlyRent,
    annualRentalFee,
    prospectEmail,
    surface: surface || null,
    bedrooms: bedrooms || null,
    locationScore: locationScore || null,
    managementCommission: {
      year1: managementCommissionYear1,
      year2: managementCommissionYear2,
      year3Plus: managementCommissionYear3Plus,
    },
    result: staticResult,
  })

  await simulation.save()

  return response
}

module.exports = {
  createSimulation,
}