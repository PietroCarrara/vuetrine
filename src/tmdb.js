const { default: TheMovieDB } = require("./tmdb/tmdb");

var tmdb = new TheMovieDB(process.env.TMDB_KEY);

export default tmdb;