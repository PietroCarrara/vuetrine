import Vue from 'vue'
import App from './App.vue'
import router from './router'
import AsyncComputed from 'vue-async-computed'
import TheMovieDB from './tmdb/tmdb.js';

Vue.config.productionTip = false;

Vue.use(AsyncComputed);

var tmdb = new TheMovieDB(process.env.TMDB_KEY);

new Vue({
    render: h => h(App),
    data: () => {
        return {
            movieDetails: {},
            showDetails: {},
            seasonDetails: {},
        }
    },
    router,
    methods: {
        // TODO: Use query results to fill the details cache
        getImageUrl(relative, size) {
            return tmdb.common.getImageUrl(relative, size);
        },
        getRecommendedMovies(id) {
            return tmdb.movie.getRecommended(id);
        },
        getRecommendedShows(id) {
            return tmdb.tv.getRecommended(id);
        },
        getSimilarMovies(id) {
            return tmdb.movie.getSimilar(id);
        },
        getSimilarShows(id) {
            return tmdb.tv.getSimilar(id);
        },
        getMovieVideos(id) {
            return tmdb.movie.getVideos(id);
        },
        getShowVideos(id) {
            return tmdb.tv.getVideos(id);
        },
        getPopularMovies() {
            return tmdb.movie.getPopular();
        },
        getPopularShows() {
            return tmdb.tv.getPopular();
        },
        searchMovies(name, page, opts) {
            return tmdb.search.movie(name, page, opts);
        },
        searchShows(name, page, opts) {
            return tmdb.search.tv(name, page, opts);
        },
        getExternalShowIDs(id) {
            return tmdb.tv.getExternalIDs(id);
        },
        getMovieDetails(id) {
            if (typeof this.movieDetails[id] === 'object') {
                return this.movieDetails[id];
            }
            this.movieDetails[id] = { id, loading: true };

            tmdb.movie.getDetails(id)
                .then(m => {
                    // Copy movie attributes
                    for (var k in m) {
                        this.movieDetails[id][k] = m[k];
                    }

                    this.movieDetails[id].loading = false;
                });

            return this.movieDetails[id];
        },
        getShowDetails(id) {
            if (typeof this.showDetails[id] === 'object') {
                return this.showDetails[id];
            }
            this.showDetails[id] = { id, loading: true };

            tmdb.tv.getDetails(id)
                .then(m => {
                    // Copy show attributes
                    for (var k in m) {
                        this.showDetails[id][k] = m[k];
                    }

                    this.showDetails[id].loading = false;
                });

            return this.showDetails[id];
        },
        getSeasonDetails(showID, seasonNumber) {
            if (typeof this.seasonDetails[showID] === 'undefined') {
                this.seasonDetails[showID] = {}
            }

            if (typeof this.seasonDetails[showID][seasonNumber] === 'object') {
                return this.seasonDetails[showID][seasonNumber];
            }
            this.seasonDetails[showID][seasonNumber] = { season_number: seasonNumber, loading: true };

            tmdb.tv.getSeasonDetails(showID, seasonNumber)
                .then(m => {
                    // Copy show attributes
                    for (var k in m) {
                        this.seasonDetails[showID][seasonNumber][k] = m[k];
                    }

                    this.seasonDetails[showID][seasonNumber].loading = false;
                });

            return this.seasonDetails[showID][seasonNumber];
        }
    }
}).$mount('#app');
