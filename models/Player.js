const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    lastName: {
        type:String,
        required:true
    },
    code: {
        type:Number,
        required:true
    },
    classGroup: {
        type:String,
        required:true
    },
    group: {
        type:String,
        required:true
    },
    score: {
        type:Number,
        default:0,
        required:true
    },
    hasConnected:{
        type:Boolean,
        default:false,
        required:true
    }
})

module.exports = mongoose.model("Player", playerSchema)