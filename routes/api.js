const express = require('express');
const router = express.Router();

const Player = require('../models/Player');

router.use((req,res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${process.env.AUTH_TOKEN}`) {
        return res.status(401).json({'error': 'Unauthorized'})
    }

    next();
})

// GetUser Endpoint
router.post('/getUser', async (req,res) => {
    const userId = req.body?.user_id;

    const player = await Player.findOne({robloxId: userId})

    if (!player){
        return res.status(400).json({'error':'Player not found!'})
    }

    res.status(200).json(player);
})


module.exports = router;
