const express = require("express")
const path = require("path")
const dotenv = require("dotenv")
const { connectDatabase } = require("./config/database")
const apiRoutes = require("./routes/api")
const webRoutes = require("./routes/web")

dotenv.config()

/**
 * Create the Express app
 */
const createApp = async () => {
  try {

    const app = express()
    // middleware
    app.use(express.static(path.join(__dirname, "public")))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    // database connection
    await connectDatabase()

    const PORT = process.env.PORT || 3000

    app.get("/", (req, res) => {
      res.send("Yield Simulator server is running")
    })

    app.set("view engine", "ejs")
    app.set("views", "app/views")

    // api routes
    app.use('/api/', apiRoutes)
    // web routes
    app.use('/app', webRoutes)

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