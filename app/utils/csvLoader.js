const fs = require('fs')
const path = require('path')

let bookingData = []

/**
 * Load and parse the CSV file and store it in bookingData
 */
const loadBookingData = () => {
    try {
        const csvPath = path.join(__dirname, '../data/booking_history.csv')
        const csvContent = fs.readFileSync(csvPath, 'utf-8')

        const lines = csvContent.split('\n')

        // skip the header and return the object
        bookingData = lines.slice(1)
            .filter(line => line.trim())
            .map(line => {
                const values = line.split(',')
                return {
                    date: values[0],
                    property_id: values[1],
                    surface_m2: parseFloat(values[2]),
                    bedrooms: parseInt(values[3]),
                    location_score: parseFloat(values[4]),
                    listing_price: parseFloat(values[5]),
                    is_booked: parseInt(values[6])
                }
            })
    } catch (error) {
        console.error('Error loading booking data:', error)
        bookingData = []
    }
}

/**
 * Get booking data
 */
const getBookingData = () => {
    return bookingData
}

module.exports = {
    loadBookingData,
    getBookingData
}