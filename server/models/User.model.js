import mongoose from "mongoose"

export const userShema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide unique username..!"],
        unique: [true, 'User Exist']
    },
    password: {
        type: String,
        required: [true, "Please provide unique password...!"],
        unique: false
    },
    email: {
        type: String,
        required: [true, 'Pleas provide email...!'],
        unique: [true, "Email already taken"]
    },
    firstName: {type: String},
    lastName: {type: String},
    mobile: {type: Number},
    address: {type: String},
    profile: {type: String}
})

export default mongoose.model.User || mongoose.model('User', userShema)