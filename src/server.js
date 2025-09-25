const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')

const PORT = process.env.PORT || 8080
app.use(express.json())
app.use(cors())

const userRouter = require('./routes/users')
app.use('/users', userRouter)

console.log("Hello Node")

app.get('/', (req, res) => {
    res.json({ msg: "Hej hej" })
})

app.listen(PORT, () => {
    try {
        console.log(`Running on http://localhost:${PORT}`)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
    
})