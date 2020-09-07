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
    }
}).$mount('#app');
