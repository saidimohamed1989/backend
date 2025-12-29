const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,      
        // unique: true,      
        trim: true,     
    }, 
    email: {        
        type: String,
            required: true,
            unique: true,   
            trim: true,
            lowercase: true,
    },  
    password: {
        type: String,
        required: true,
        trim: true,
    }, 
    phone:{
        type: String,
        trim: true,
    },  
    profilePic: {
        type: String,
        default: "",
    },
    role: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
            required: true,
        },
    
},
{ timestamps: true, versionKey: false });

const User = mongoose.model('User', userSchema);
module.exports = User;