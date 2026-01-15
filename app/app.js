const express = require("express")
const dotenv = require("dotenv")

dotenv.config()


const createApp = async () => {
  try{

    const app = express()
    // middleware
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
  
    const PORT = process.env.PORT || 3000

    app.get("/", (req, res) => {
      res.send("Yield Simulator server is running")
    })

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