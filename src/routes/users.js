const express = require('express');
const bcrypt = require('bcrypt')
const router = express.Router();
const authorize = require('../middleware/authorize')

const jwt = require('jsonwebtoken')
require('dotenv').config()

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

//Ha en endpoint för inloggning (POST) som tar emot användarnamn och lösenord

router.post('/login', async (req, res) => {
    const user = await prisma.users.findUnique({
        where: { email: req.body.email }
    })

    if (user == null) return res.status(401).send({ msg: "Användare saknas" })

    const match = await bcrypt.compare(req.body.password, user.password)

    if (!match)
        return res.status(401).send({ msg: "Autentisering misslyckades" })

    const token = await jwt.sign({
        sub: user.id,
        email: user.email,
        name: user.username,
    }, process.env.JWT_SECRET, { expiresIn: '30d' })

    res.json({token});
    console.log(token)
})

//Endpoint för skapande av användare (POST), tar emot användarnamn&lösen (som hashas+saltas), skickar till db

router.post('/register', async (req, res) => {

    try {
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await prisma.users.create({
            data: {
                email: req.body.email,
                username: req.body.username,
                password: hashPassword
            }
        })
        res.json({ msg: "Registrerad! Välkommen:", id: newUser.username })
    } catch (error) {
        console.log(500)
        res.status(500).send({ msg: "Error: kunde inte skapa användare" })
    }
})

module.exports = router;