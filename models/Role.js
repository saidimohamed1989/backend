const mongoose = require('mongoose');



const roleSchema = new mongoose.Schema(
    {
    titre: {
        type: String, 
        required: true,
        unique: true,
        trim: true, 
        uppercase: true,
    },      
    permission: [
    {
        type: String,
    },
],
},
{ timestamps: true, versionKey: false }
);
const Role = mongoose.model('Role', roleSchema);
module.exports = Role;
