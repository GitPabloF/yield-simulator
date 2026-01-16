const { getBookingData } = require("../utils/csvLoader")

/**
 * Get occupancy prediction based on property characteristics
 * @param {Object} params - Property characteristics
 * @param {number} params.surface - Property surface in m²
 * @param {number} params.bedrooms - Number of bedrooms
 * @param {number} params.locationScore - Location score (1-10)
 * @returns {Object|null} Prediction data
 */
const getOccupancyPrediction = (params) => {
  const { surface, bedrooms, locationScore } = params
  const bookingData = getBookingData()

  if (!bookingData || bookingData.length === 0) {
    console.error("No booking data available for prediction")
    return null
  }

  // Convert inputs to numbers
  const surfaceNum = Number(surface)
  const bedroomsNum = Number(bedrooms)
  const locationScoreNum = Number(locationScore)

  // Helper function to filter properties based on criteria
  const filterProperties = (bedroomRange, surfaceRange, locationRange) => {
    return bookingData.filter((record) => {
      const bedroomMatch = Math.abs(record.bedrooms - bedroomsNum) <= bedroomRange
      const surfaceMatch =
        record.surface_m2 >= surfaceNum * (1 - surfaceRange) &&
        record.surface_m2 <= surfaceNum * (1 + surfaceRange)
      const locationMatch = Math.abs(record.location_score - locationScoreNum) <= locationRange
      return bedroomMatch && surfaceMatch && locationMatch
    })
  }

  // 3 relaxation levels
  const relaxationLevels = [
    // Level 1: same number of bedrooms - surface +-20%, location +-1.5
    { bedrooms: 0, surface: 0.2, location: 1.5, confidence: "high" },
    // Level 2: -+1 bedroom - surface +-30%, location +-2.5
    { bedrooms: 1, surface: 0.3, location: 2.5, confidence: "medium" },
    // Level 3: All data
    { bedrooms: null, confidence: "low" },
  ]

  let dataToAnalyze = []
  let usedLevel = null

  // Try each relaxation level until we have enough data
  for (const level of relaxationLevels) {
    // Level 3: use all data
    if (level.bedrooms === null) {
      dataToAnalyze = bookingData
      usedLevel = level
      break
    }

    dataToAnalyze = filterProperties(
      level.bedrooms,
      level.surface,
      level.location
    )

    // if we have enough data try another level
    if (dataToAnalyze.length >= 100) {
      usedLevel = level
      break
    }
  }

  // Calculate occupancy rate in percentage
  const totalRecords = dataToAnalyze.length
  const bookedRecords = dataToAnalyze.filter(
    (record) => record.is_booked === 1
  ).length
  const occupancyRate = (bookedRecords / totalRecords) * 100

  // Calculate average listing price per night
  const avgNightlyPrice =
    dataToAnalyze.reduce((sum, record) => sum + record.listing_price, 0) /
    totalRecords

  // Calculate price per m2 for benchmarking
  const avgPricePerM2 =
    dataToAnalyze.reduce(
      (sum, record) => sum + record.listing_price / record.surface_m2,
      0
    ) / totalRecords

  return {
    occupancyRate: Math.round(occupancyRate * 10) / 10,
    avgNightlyPrice: Math.round(avgNightlyPrice * 100) / 100,
    avgPricePerM2: Math.round(avgPricePerM2 * 100) / 100,
    similarPropertiesCount: dataToAnalyze.length,
    dataPointsAnalyzed: totalRecords,
    confidence: usedLevel.confidence,
  }
}

module.exports = {
  getOccupancyPrediction,
}