const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')

const PORT = process.env.PORT || 8080
app.use(express.json())
app.use(cors({
  origin: "https://people.arcada.fi/~rehnstli/post-it-projekt1/",
  credentials: true
}))

const userRouter = require('./routes/users')
app.use('/users', userRouter)

app.get('/', (req, res) => {
    res.json({ msg: "Hej hej" })
})

app.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`)
    
})