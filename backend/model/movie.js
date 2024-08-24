import mongoose from "mongoose";

const movieScema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    duration: {
        type: String,
        require: true,
    },
    categories: {
        type: Array,
        require: true,
    },
    language: {
        type: Array,
        require: true,
    },
    cast: {
        type: Array,
        require: true,
    },
    poster: {
        type: String,
        require: true
    }
})

const Movie = mongoose.model('Movie', movieScema)
export default Movie