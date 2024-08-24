import expressAsyncHandler from "express-async-handler"
import Movie from "../model/movie.js"

let movieController = {
    addMovie: expressAsyncHandler(async (req, res) => {
        const { name, duration, categories, language, cast, poster } = req.body;
        try {

            const movieExists = await Movie.findOne({ name });
            if (movieExists) {
                res.status(400);
                throw new Error("Movie already exists");
            }

            const movie = new Movie({
                name,
                duration,
                categories,
                language,
                cast,
                poster,
            });

            const createdMovie = await movie.save();

            res.status(201).json(createdMovie);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    })
}

export default movieController