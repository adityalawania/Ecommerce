const mongoose = require('mongoose')




const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true

    },
    brand: {
        type: String,
    },

    rating:[
        {
            type:Number
        }
    ],
 
    category: {
        type: String,
        required: true

    },
    moreCategory: {
        type: String
    },
    gender: {
        type: String,
    },
    size: [{
        type: String,

    }],
    color: [
        {
            type: String,


        }
    ],
    img:[{
        type:String
    }],
    price: [{
        type: Number,
        required: true
    }],
    desc: {
        type: String,

    },

    availabileQty: {
        type: Number,

    },
    reviews:[{
            type:Object
    }]
}, { timestamps: true })


mongoose.models = {}

 
export default mongoose.model("Product", ProductSchema)  