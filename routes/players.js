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
router.get('/:id',(req,res)=>{
    res.send(req.params.id)
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


module.exports = router