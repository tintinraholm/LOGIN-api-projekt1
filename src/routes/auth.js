const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

//Ha en endpoint för skapande av ny användare (POST) som tar emot att användarnamn och lösenord, saltar+hashar lösenordet (använd t.ex. bcrypt), och sparar alltihop i databasen.

router.post('/register', async (req, res) => {
    const username = req.body;
    const password = req.body;


})

//Ha en endpoint för inloggning (POST) som tar emot användarnamn och lösenord

/*router.post('/login', async (req, res) => {
    const username = req.body;
    const password = req.body;
    
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({

        })
    }
})*/
//Ha en endpont boards/ som returnerar de boards en viss användare har tillgång till.

module.exports = router;