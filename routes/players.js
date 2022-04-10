const express= require('express')
const router = express.Router()
const Player = require('../models/Player')

//Get all
router.get('/', async (req,res)=>{
    try {
        const players = await Player.find()
        res.json(players)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})
//Get one
router.get('/:id', getPlayer,(req,res)=>{
    res.send(res.player.name)
})
//Creating one
router.post('/',async (req,res)=>{
    const player = new Player({
        name:req.body.name,
        lastName:req.body.lastName,
        code:req.body.code,
        classGroup:req.body.classGroup,
        group:req.body.group
    })

    try {
        const newPlayer = await player.save()
        res.status(201).json(newPlayer)
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})
//Updaate one
router.patch('/:id',(req,res)=>{

})
//Delete one
router.delete('/:id',(req,res)=>{

})

async function getPlayer(req,res,next){
    let player
    try {
        player = await Player.findById(req.params.id)
        if(player==null){
            return res.status(404).json({message:'Cannot find player'})
        }
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
    res.player = player
    next()
}

module.exports = router