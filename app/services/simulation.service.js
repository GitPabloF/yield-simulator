const Simulation = require("../models/Simulation")
const { calculateYield } = require("./yield.service")

/**
 * Create a new simulation
 * @param {Object} params 
 * @param {number} params.purchasePrice 
 * @param {number} params.monthlyRent 
 * @param {number} params.annualRentalFee 
 * @param {string} params.prospectEmail 
 * @param {number} params.managementCommissionYear1 
 * @param {number} params.managementCommissionYear2 
 * @param {number} params.managementCommissionYear3Plus 
 * @returns {Promise<Object>}
 */
const createSimulation = async ({
  purchasePrice,
  monthlyRent,
  annualRentalFee,
  prospectEmail,
  managementCommissionYear1 = 0.3,
  managementCommissionYear2 = 0.25,
  managementCommissionYear3Plus = 0.2,
}) => {

  // call the yield service to calculate the yield
  const result = calculateYield({
    purchasePrice,
    monthlyRent,
    annualRentalFee,
    managementCommissionYear1,
    managementCommissionYear2,
    managementCommissionYear3Plus,
  })

  // create a new simulation in the DB
  const simulation = new Simulation({
    purchasePrice,
    monthlyRent,
    annualRentalFee,
    prospectEmail,
    managementCommission: {
      year1: managementCommissionYear1,
      year2: managementCommissionYear2,
      year3Plus: managementCommissionYear3Plus,
    },
    result,
  })

  await simulation.save()
  return result
}

module.exports = {
  createSimulation,
}
