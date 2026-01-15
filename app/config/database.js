const mongoose = require("mongoose")

/**
 * Connect to the MongoDB database
 */
const connectDatabase = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/emerald_yield_simulator"
    await mongoose.connect(mongoURI)
    console.log("MongoDB connected successfully")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  }
}

/**
 * Disconnect from the MongoDB database
 */
const disconnectDataBase = async () => {
  try {
    await mongoose.connection.close()
  } catch (error) {
    console.error("Error closing MongoDB connection:", error)
  }
}

module.exports = {
  connectDatabase,
  disconnectDataBase,
}
