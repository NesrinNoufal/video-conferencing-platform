import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{timeStamps:true});

const User = new Schema("userSchema");

export default User;