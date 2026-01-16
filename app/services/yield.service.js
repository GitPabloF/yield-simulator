/**
 * Calculate the net yield based on input data
 *
 * @param {Object} data
 * @param {number} purchasePrice
 * @param {number} monthlyRent
 * @param {number} annualRentalFee
 * @param {number} managementCommissionYear1
 * @param {number} managementCommissionYear2
 * @param {number} managementCommissionYear3Plus
 * @param {number} occupancyRate 
 * @returns {Object} Computed yield information
 */
const calculateYield = ({
  purchasePrice,
  monthlyRent,
  annualRentalFee,
  managementCommissionYear1,
  managementCommissionYear2,
  managementCommissionYear3Plus,
  occupancyRate = 1.0,
}) => {
  // validate input data
  if (
    purchasePrice === undefined ||
    purchasePrice === null ||
    purchasePrice <= 0
  ) {
    throw new Error("Purchase price must be greater than zero.")
  }

  if (monthlyRent === undefined || monthlyRent === null || monthlyRent < 0) {
    throw new Error("Monthly rent cannot be negative.")
  }

  if (
    annualRentalFee === undefined ||
    annualRentalFee === null ||
    annualRentalFee < 0
  ) {
    throw new Error("Annual rental fee cannot be negative.")
  }

  if (managementCommissionYear1 < 0) {
    throw new Error("Management commission year 1 cannot be negative.")
  }

  if (managementCommissionYear2 < 0) {
    throw new Error("Management commission year 2 cannot be negative.")
  }

  if (managementCommissionYear3Plus < 0) {
    throw new Error("Management commission year 3 plus cannot be negative.")
  }

  // implement the gross annual within the occupancy rate
  const grossAnnualRent = monthlyRent * 12 * occupancyRate

  // calculate the result for each year
  const calculateYearResult = (commissionRate) => {
    const annualNetIncome =
      grossAnnualRent - annualRentalFee - grossAnnualRent * commissionRate

    const monthlyNetIncome = annualNetIncome / 12
    const returnRate = (annualNetIncome / purchasePrice) * 100

    return {
      monthlyNetIncome: Number(monthlyNetIncome.toFixed(2)),
      returnRate: Number(returnRate.toFixed(2)),
      annualNetIncome: Number(annualNetIncome.toFixed(2)),
    }
  }

  const year1 = calculateYearResult(managementCommissionYear1)
  const year2 = calculateYearResult(managementCommissionYear2)
  const year3 = calculateYearResult(managementCommissionYear3Plus)

  const totalNetIncome3Years =
    year1.annualNetIncome + year2.annualNetIncome + year3.annualNetIncome

  const returnOver3Years = (totalNetIncome3Years / purchasePrice) * 100

  return {
    year1: {
      monthlyNetIncome: year1.monthlyNetIncome,
      annualNetIncome: year1.annualNetIncome,
      returnRate: year1.returnRate,
    },
    year2: {
      monthlyNetIncome: year2.monthlyNetIncome,
      annualNetIncome: year2.annualNetIncome,
      returnRate: year2.returnRate,
    },
    year3: {
      monthlyNetIncome: year3.monthlyNetIncome,
      annualNetIncome: year3.annualNetIncome,
      returnRate: year3.returnRate,
    },
    returnOver3Years: Number(returnOver3Years.toFixed(2)),
  }
}

module.exports = {
  calculateYield,
}
