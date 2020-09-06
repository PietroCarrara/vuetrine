import Vue from 'vue'
import App from './App.vue'
import tmdb from './tmdb';

Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
    data: () => {
        return {
            movieDetails: {},
        }
    },
    methods: {
        getMovieDetails(id) {
            if (typeof this.movieDetails[id] === 'object') {
                return this.movieDetails[id];
            }
            this.movieDetails[id] = { loading: true };

            tmdb.movie.getDetails(id)
            .then(m => {
                this.movieDetails[id].loading = false;
                // Copy movie attributes
                for (var k in m) {
                    this.movieDetails[id][k] = m[k];
                }
            })

            return this.movieDetails[id];
        }
    },
}).$mount('#app');
