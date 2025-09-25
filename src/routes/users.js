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
        where: { email: req.body.email } //req.authUser.id
    })

    if (user == null) return res.status(401).send({ msg: "Authentication failed (bad user)" })

    const match = await bcrypt.compare(req.body.password, user.password)

    if (!match)
        return res.status(401).send({ msg: "Autentication failed" })

    const token = await jwt.sign({
        sub: user.id,
        email: user.email,
        name: user.username,
    }, process.env.JWT_SECRET, { expiresIn: '30d' })

    // res.send({ msg: "Login ok.", jwt: token })
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
        res.status(500).send({ msg: "Error: Failed to create user" })
    }
})

//Ha en endpoint boards/, returnerar de boards användaren har rätt till

router.get('/boards', authorize, async (req, res) => {

    try {
        const boards = await prisma.boards.findMany({
            where: { userId: parseInt(req.authUser.sub) }
        })
        console.log(boards);

        res.json(boards)
    } catch (error) {
        console.error("Fel vid Prisma-query:", error);
        res.status(500).json({ msg: "Error. Problem fetching boards", error: error.message })
    }
})

module.exports = router;