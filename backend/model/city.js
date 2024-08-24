import mongoose from "mongoose";

const citySchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    }
})

export default mongoose.model('City',citySchema)