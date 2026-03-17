const express = require('express');
const router = express.Router();

const Player = require('../models/Player');

router.use((req,res, next) => {
    const authHeader = req.headers.authorization;

    if (!(req.baseUrl == '/getUser')) {
        next();
    }

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

// Get Discord ID Endpoint
router.get('/roblox-to-discord/:roblox_id', async (req, res) => {
    const roblox_id = req.params.roblox_id

    if (!roblox_id){
        return res.status(400).json({'error': 'Id not provided'})
    }

    const player = await Player.findOne({robloxId: roblox_id})

    if (!player){
        return res.status(400).json({'error':'Player not found!'})
    }

    return res.status(200).json(
        {
            'robloxId': player.robloxId, 
            'discordId': player.discordId,
            'msg': 'Discord ID found'
        }
    )
})

router.get('/getFines/:roblox_id', async (req, res) => {
        const roblox_id = req.params.roblox_id

    if (!roblox_id){
        return res.status(400).json({'error': 'Id not provided'})
    }

    const player = await Player.findOne({robloxId: roblox_id})

    if (!player){
        return res.status(400).json({'error':'Player not found!'})
    }

    return res.status(200).json(player.fine)

})



module.exports = router;
