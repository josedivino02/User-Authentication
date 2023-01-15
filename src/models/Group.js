const mongoose = require("mongoose")

const { Schema } = mongoose

const groupSchema = new Schema({
    abv:            { type: String, required: true },
    description:    { type: String, required: true }
},  { timestamps: true })

const Group = mongoose.model("Group", groupSchema)

module.exports = Group