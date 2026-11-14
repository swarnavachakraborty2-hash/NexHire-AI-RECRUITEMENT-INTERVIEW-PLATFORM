import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minLength: [5, "Password must be at least 5 characters long"],
        maxLength: [20, "Password cant be more than 20 characters"]
    },
    role: {
        enum: ['Recruiter', 'Candidate'],
        required: true
    },
    avatar: {
        type: String,
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
})

userSchema.pre("save", async () => {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    else {
        return
    }
})

userSchema.methods.verifyPassword = async (password) => {
    return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = () => {

}


userSchema.methods.generateRefreshToken = async () => {

}



const userModel = mongoose.model("user", userSchema)

export default userModel