const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    text : {
        type : String,
        required : true,
    },
    createdAt:{
        type : Date,
        default : Date.now,
    }
})

const TicketSchema = new mongoose.Schema({
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum : ["Open" , "In Progress" , "Closed"],
        default : "Open"    
    },
    priority : {
        type : String,
        enum : ["Low" , "Medium" , "High"],
        default : "Medium" 
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    slaDeadline: { 
    type: Date,
  },
    comments : [CommentSchema]
})

module.exports = mongoose.model('Ticket' , TicketSchema)