const express = require('express');
const router = express.Router();

const Player = require('../models/Player');

router.use((req,res, next) => {
    const authHeader = req.headers.authorization;

    if (!(req.path == '/getUser')) {
        return next();
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

// Get Fines Endpoint
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


// Remove Fine Endpoint
router.post('/removeFine/:roblox_id/:fine_id', async (req, res) => {
    const roblox_id = req.params.roblox_id
    const fine_id = req.params.fine_id

    if (!roblox_id){
        return res.status(400).json({'error': 'Roblox not provided', 'success': false})
    }

    const player = await Player.findOne({robloxId: roblox_id})

    if (!player){
        return res.status(400).json({'error':'Player not found!', 'success': false})
    }

    if (!fine_id) {
        return res.status(400).json({'error': 'Fine ID not provided', 'success': false})
    }

    const fine = player.fine.find(f => f._id.equals(fine_id));
    const removing = fine

    if (!fine){
        return res.status(400).json({'error': 'Fine not found', 'success': false})
    }

    let amount = req.query.amount
    if (!amount){
        return res.status(400).json({'error': 'No amount provided', 'success': false})
    }

    const amount_to_remove = Number(amount)

    const difference = fine.amount - amount_to_remove
    if (amount_to_remove <= 0){
        return res.status(400).json({'error': 'Invalid amount (must be greater than 0', 'success': false})
    }

    if (difference > 0){
        fine.amount = difference
    }

    else {
        player.fine = player.fine.filter(f => !(f._id.equals(fine_id)))
    }

    await player.save()

    const payload = {
        embeds: [
            {
            title: `💸 Fine ${difference > 0 ? "Partially " : ""}Bailed`,
            color: 0x00BFFF,
            fields: [
                {
                name: "User",
                    value: `<@${player.discordId}>`,
                inline: true
                },
                {
                name: "By",
                value: `Donation Center (In Game)`,
                inline: true
                },
                {
                name: "Reason",
                value: removing.reason || "No reason provided",
                inline: false
                },
                {
                name: `Amount${difference > 0 ? " Bailed" : ""}`,
                value: `${difference > 0 ? amount_to_remove : removing.amount} robux`,
                inline: true
                }
            ],
            timestamp: new Date().toISOString()
            }
        ]
        };

    let webhook_success = false
    try {
        const res = await fetch(process.env.WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        webhook_success = true
    }

    catch (e){
        webhook_success = false
        console.log(e)
    }

    if (difference > 0){


        return res.status(200).json({'msg': `Success! Fine partially bailed for ${amount_to_remove} Robux.`, 'success': true, 'webhook_success': webhook_success})
    }

    else {
        return res.status(200).json({'msg': `Success! Fine with ${removing.reason} for ${removing.amount} Robux (Roblox ID: ${player.robloxId}) has been removed.`, 'success': true, 'webhook_success': webhook_success})
    }
})


module.exports = router;
