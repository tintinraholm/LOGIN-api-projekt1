const express = require('express')
require('dotenv').config()
const authRouter = require('./routes/auth')

const app = express()
const PORT = process.env.PORT || 8080

console.log("Hello Node")

app.use(express.json())

app.get('/', (req, res) => {
    res.json({ msg: "Hej hej" })
})

app.use('/auth', authRouter)

app.listen(PORT, () => {
    try {
        console.log(`Running on http://localhost:${PORT}`)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
    
})