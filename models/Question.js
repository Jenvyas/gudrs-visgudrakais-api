const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    questionText:{
        type:String,
        required:true
    },
    correctAnswer:{
        type:String,
        required:true
    },
    group:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model("Question", questionSchema)