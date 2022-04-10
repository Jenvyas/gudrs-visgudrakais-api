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
    stage:{
        type:Number,
        required:true
    },
    group:{
        type:Number,
        required:true
    },
    answerTextA:{
        type:String
    },
    answerTextB:{
        type:String
    },
    answerTextC:{
        type:String
    },
    answerTextD:{
        type:String
    }
})

module.exports = mongoose.model("Question", questionSchema)