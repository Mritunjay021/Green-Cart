import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true
    },
    cartItems: {
        type:Object,
        default:{}
    }
}, {minimize:false})

const User = mongoose.models.userschema || mongoose.model('userschema',userschema);

export default User;