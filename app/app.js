const express = require("express")
const path = require("path")
const dotenv = require("dotenv")
const rateLimit = require("express-rate-limit")
const { connectDatabase } = require("./config/database")
const apiRoutes = require("./routes/api")
const webRoutes = require("./routes/web")
const { loadBookingData } = require("./utils/csvLoader")

dotenv.config()

/**
 * Create the Express app
 */
const createApp = async () => {
  try {
    const app = express()

    // limit each IP to 100 requests per 15 minutes for public API routes
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    })

    // middleware
    app.use(express.static(path.join(__dirname, "public")))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use("/api/simulation", limiter)

    // database connection
    await connectDatabase()

    // load booking data
    loadBookingData()

    const PORT = process.env.PORT || 3000

    app.set("view engine", "ejs")
    app.set("views", "app/views")

    // api routes
    app.use("/api/", apiRoutes)
    // web routes
    app.use("/", webRoutes)

    // start server
    app.listen(PORT, () => {
      console.log(`Server is listening on http://localhost:${PORT}`)
    })

    return app
  } catch (error) {
    console.error("Error creating app:", error)
    process.exit(1)
  }
}

createApp()
