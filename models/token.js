const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forgetMPSchema = new Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    token:{
        type: String,
        require:true
    },
    creatAdt:{
        type: Date,
        default: Date.now,
        expire: 3600
    }
})

const Token = mongoose.model('PaWResetToken', forgetMPSchema) ;
module.exports = Token;