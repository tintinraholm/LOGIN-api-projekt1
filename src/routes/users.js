const express = require('express');
const bcrypt = require('bcrypt')
const router = express.Router();

const jwt = require('jsonwebtoken')
require('dotenv').config()

const { PrismaClient } = require('@prisma/client');
const { error } = require('console');
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

    //access-token
    const token = await jwt.sign({
        sub: user.id,
        email: user.email,
        name: user.username,
    }, process.env.JWT_SECRET, { expiresIn: '15m' })

    //refresh-token
    const refreshToken = await jwt.sign({
        sub: user.id,
        mail: user.email,
        name: user.username,
    }, process.env.JWT_SECRET, { expiresIn: '30d' })

    await prisma.refresh_tokens.create({
        data: { user_id: user.id, token: refreshToken }
    })

    res.json({ token, refreshToken });
    console.log(token)
    console.log(refreshToken)

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

router.post('/refresh', async (req, res) => {
    //skicka refreshtoken som auktoriserings-header

    try {
        const authHeader = req.headers['authorization'];
        const refreshToken = authHeader && authHeader.split(" ")[1];
        if (!refreshToken) return res.status(401).json({ msg: 'No refresh token' });

        const storedToken = await prisma.refresh_token.findUnique({
            where: { token: refreshToken }
        });
        if (!storedToken) return res.status(403).json({ msg: 'Inte giltig refreshtoken' });

        const user = await prisma.user.findUnique({
            where: { id: req.body.id }
        });

        if (storedToken) {
            const token = await jwt.sign({
                sub: user.id,
                email: user.email,
                name: user.username,
            }, process.env.JWT_SECRET, { expiresIn: '15m' })

            res.json(token)
        }
    } catch (error) {
        console.error(error);
        res.status(403).json({ msg: 'Invalid/expired refresh token' });
    }

})

router.delete('/logout', async (req, res) => {
    //radera refreshtoken, radera session token från lokalstorage

    try {
        const authHeader = req.headers['authorization'];
        const refreshToken = authHeader && authHeader.split(" ")[1];
        if (!refreshToken) return res.status(401).json({ msg: 'No token provided' });

        if (refreshToken) {
            await prisma.refresh_tokens.delete({
                where: {
                    token: refreshToken
                }
            })
        }
        return res.json({ msg: 'Utloggad' })
    } catch (error) {
        if (error) {
            return res.status(404).json({ msg: 'Token not found' });
        }
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
})

module.exports = router;