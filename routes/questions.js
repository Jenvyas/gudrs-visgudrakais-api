const express= require('express')
const router = express.Router()
const Question = require('../models/Question')

//Get all
router.get('/', async (req,res)=>{
    try {
        const questions = await Question.find()
        res.json(questions)
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
    const question = new Question({
        stage:req.body.stage,
        questionText:req.body.questionText,
        correctAnswer:req.body.correctAnswer,
        answerTextA:req.body.answerTextA,
        answerTextB:req.body.answerTextB,
        answerTextC:req.body.answerTextC,
        answerTextD:req.body.answerTextD,
        index:req.body.index,
        group:req.body.group
    })

    try {
        const newQuestion = await question.save()
        res.status(201).json(newQuestion)
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