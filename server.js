const express = require("express");
const app = express();
const axios = require("axios");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

let API_KEY = "";
const BASE_URL = "https://api.themoviedb.org/3";

app.get("/", async (req, res) => {
    try {
        
        const genreResponse = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=ko`);
        const genres = genreResponse.data.genres;
        res.render("index", { genres });
    } catch (error) {
        res.status(500).send("Error fetching genres.");
    }
});


app.get("/movies", async (req, res) => {
    const genreId = req.query.genreId;
    const today = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);

    const releaseDateGte = lastYear.toISOString().split("T")[0]; 
    const releaseDateLte = today.toISOString().split("T")[0]; 

    try {
        const moviesResponse = await axios.get(
            `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ko&region=KR&with_genres=${genreId}&sort_by=popularity.desc&release_date.gte=${releaseDateGte}&release_date.lte=${releaseDateLte}`
        );

        
        const movies = moviesResponse.data.results
            .filter(movie => movie.vote_average > 0)
            .slice(0, 7);
        res.json(movies);
    } catch (error) {
        res.status(500).send("Error fetching movies.");
    }
});

app.listen(3002, () => {
    console.log("서버 시작");
});
