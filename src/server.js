const express = require('express')
require('dotenv').config()
const app = express()

const PORT = process.env.PORT || 8080
app.use(express.json())

const userRouter = require('./routes/users')
app.use('/users', userRouter)
//app.use(cors()) //tillåt requests från alla origins

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