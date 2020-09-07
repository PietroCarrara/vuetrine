import Vue from 'vue'
import App from './App.vue'
import tmdb from './tmdb';
import router from './router'
import AsyncComputed from 'vue-async-computed'

Vue.config.productionTip = false;

Vue.use(AsyncComputed);

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
