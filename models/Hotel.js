const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Hotelchema = new Schema (
    {
        imgUrl:{
            type: String,
            require: true,
        } ,
        adresse:{
            type: String,
            require: true,
        },
        titre: {
            type: String,
            require: true,
        },
        prix:{
            type:String,
            require: true,
        }
    },
    { timestamps: true }
)

const Hotel = mongoose.model("Hotels", Hotelchema)

module.exports = Hotel;