const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')

const PORT = process.env.PORT || 8080
app.use(express.json())
app.use(cors({
    origin: ["https://people.arcada.fi", "https://localhost", "https://127.0.0.1", "capacitor://localhost", "*"]
}))

const userRouter = require('./routes/users')
app.use('/users', userRouter)

app.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`)
})