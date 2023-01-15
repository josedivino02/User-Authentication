const mongoose = require("mongoose")

const { Schema } = mongoose

const userSchema = new Schema({
    name:               { type: String, required: true },
    email:              { type: String, required: true },
    cpf:                { type: String, required: true },
    birthDate:          { type: Date,   required: true },
    password:           { type: String, required: true },
    group:              { type: String }
},  { timestamps: true })

const User = mongoose.model("User", userSchema)

module.exports = User