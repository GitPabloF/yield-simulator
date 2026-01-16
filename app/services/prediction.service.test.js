const { getOccupancyPrediction } = require("./prediction.service")
const { getBookingData } = require("../utils/csvLoader")

// Mock the csvLoader module
jest.mock("../utils/csvLoader")

describe("PredictionService", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("getOccupancyPrediction", () => {
        it("should return null when no historical data is available", () => {
            getBookingData.mockReturnValue([])

            const result = getOccupancyPrediction({
                surface: 50,
                bedrooms: 2,
                locationScore: 8,
            })

            expect(result).toBeNull()
        })

        it("should return null when historical data is undefined", () => {
            getBookingData.mockReturnValue(undefined)

            const result = getOccupancyPrediction({
                surface: 50,
                bedrooms: 2,
                locationScore: 8,
            })

            expect(result).toBeNull()
        })

        it("should calculate occupancy rate correctly", () => {
            // 3 booked out of 5 = 60% occupancy
            const mockData = [
                { bedrooms: 2, surface_m2: 50, location_score: 8, listing_price: 100, is_booked: 1 },
                { bedrooms: 2, surface_m2: 50, location_score: 8, listing_price: 100, is_booked: 1 },
                { bedrooms: 2, surface_m2: 50, location_score: 8, listing_price: 100, is_booked: 1 },
                { bedrooms: 2, surface_m2: 50, location_score: 8, listing_price: 100, is_booked: 0 },
                { bedrooms: 2, surface_m2: 50, location_score: 8, listing_price: 100, is_booked: 0 },
            ]
            getBookingData.mockReturnValue(mockData)

            const result = getOccupancyPrediction({
                surface: 50,
                bedrooms: 2,
                locationScore: 8,
            })

            expect(result.occupancyRate).toBe(60)
        })

        it("should calculate average nightly price correctly", () => {
            const mockData = [
                { bedrooms: 2, surface_m2: 50, location_score: 8, listing_price: 100, is_booked: 1 },
                { bedrooms: 2, surface_m2: 50, location_score: 8, listing_price: 200, is_booked: 1 },
                { bedrooms: 2, surface_m2: 50, location_score: 8, listing_price: 300, is_booked: 0 },
            ]
            getBookingData.mockReturnValue(mockData)

            const result = getOccupancyPrediction({
                surface: 50,
                bedrooms: 2,
                locationScore: 8,
            })

            expect(result.avgNightlyPrice).toBe(200)
        })

        it("should return high confidence with strict criteria match (>= 100 properties)", () => {
            const mockData = Array.from({ length: 150 }, (_, i) => ({
                bedrooms: 2,
                surface_m2: 50,
                location_score: 8,
                listing_price: 100 + i,
                is_booked: i % 2,
            }))
            getBookingData.mockReturnValue(mockData)

            const result = getOccupancyPrediction({
                surface: 50,
                bedrooms: 2,
                locationScore: 8,
            })

            expect(result.confidence).toBe("high")
            expect(result.similarPropertiesCount).toBe(150)
        })

        it("should relax criteria and return medium confidence when strict match < 100", () => {
            const strictMatches = Array.from({ length: 50 }, () => ({
                bedrooms: 2,
                surface_m2: 50,
                location_score: 8,
                listing_price: 100,
                is_booked: 1,
            }))
            const relaxedMatches = Array.from({ length: 100 }, () => ({
                bedrooms: 3,
                surface_m2: 55,
                location_score: 9,
                listing_price: 150,
                is_booked: 0,
            }))
            getBookingData.mockReturnValue([...strictMatches, ...relaxedMatches])

            const result = getOccupancyPrediction({
                surface: 50,
                bedrooms: 2,
                locationScore: 8,
            })

            expect(result.confidence).toBe("medium")
        })

        it("should use all data and return low confidence when relaxed match < 100", () => {
            const mockData = Array.from({ length: 20 }, () => ({
                bedrooms: 4,
                surface_m2: 150,
                location_score: 3,
                listing_price: 500,
                is_booked: 1,
            }))
            getBookingData.mockReturnValue(mockData)

            const result = getOccupancyPrediction({
                surface: 50,
                bedrooms: 2,
                locationScore: 8,
            })

            expect(result.confidence).toBe("low")
            expect(result.similarPropertiesCount).toBe(20)
        })

        it("should return all required fields in response", () => {
            const mockData = Array.from({ length: 100 }, () => ({
                bedrooms: 2,
                surface_m2: 50,
                location_score: 8,
                listing_price: 150,
                is_booked: 1,
            }))
            getBookingData.mockReturnValue(mockData)

            const result = getOccupancyPrediction({
                surface: 50,
                bedrooms: 2,
                locationScore: 8,
            })

            expect(result).toHaveProperty("occupancyRate")
            expect(result).toHaveProperty("avgNightlyPrice")
            expect(result).toHaveProperty("avgPricePerM2")
            expect(result).toHaveProperty("similarPropertiesCount")
            expect(result).toHaveProperty("dataPointsAnalyzed")
            expect(result).toHaveProperty("confidence")
        })
    })
})