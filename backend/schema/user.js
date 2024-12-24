import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    
    email: {
        type:String,
        required: true
    },
    password: {
        type: String, 
        required: true
    },
    access: {
        type: String,
        enum: ["student", "teacher"],
        required: true,
        default: "student"
    }

});

const User = mongoose.model('User', userSchema);

export default User;
