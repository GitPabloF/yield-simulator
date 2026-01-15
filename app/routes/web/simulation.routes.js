const express = require("express")
const router = express.Router()


router.get('/', (req, res) => {
    res.render('simulation/index')
})

module.exports = router