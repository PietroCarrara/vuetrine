import Vue from 'vue'
import App from './App.vue'
import router from './router'
import AsyncComputed from 'vue-async-computed'
import { TheMovieDBCacheProxy } from './tmdb/tmdbcache.js'
import { clients } from './clients/clients';
import { providers } from './providers/providers'

Vue.config.productionTip = false;

Vue.use(AsyncComputed);

/**
 * Select the best torrent.
 * You might want to customize this per deploy.
 * The implementation bellow is naive and specific to my use-case.
 * @param {[TorrentMagnet]} torrents
 * @returns {TorrentMagnet|null}
 */
const bestMagnet = (torrents) => {
    // Filter hevc out
    torrents = torrents.filter(t => {
        const name = t.title.toLowerCase();
        return !(name.includes('hevc') && name.includes('x265'))
    });

    for (var torrent of torrents) {
        const name = torrent.title.toLowerCase();
        if (name.includes('1080p')) {
            return torrent;
        }
    }

    // If no 1080p is found, just return the 1st one
    if (torrents.length > 0) {
        return torrents[0];
    } else {
        return null;
    }
}

Vue.filter('size', size => {
    var i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(1) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
});

new Vue({
    render: h => h(App),
    data: () => {
        return {
            provider: null,
            client: null,
            tmdb: null,
        };
    },
    router,
    methods: {
        bestMagnet,
        saveTMDB() {
            if (this.tmdb) {
                localStorage.setItem('tmdb-key', this.tmdb.key);
            }
        },
        saveClient() {
            if (this.client) {
                for (var type in clients) {
                    if (this.client instanceof clients[type]) {
                        localStorage.setItem('client-type', type);
                        this.client.save();
                        return;
                    }
                }
            }
        },
        saveProvider() {
            if (this.provider) {
                for (var type in providers) {
                    if (this.provider instanceof providers[type]) {
                        localStorage.setItem('provider-service', type);
                        return;
                    }
                }
            }
        },
        // Saves the data specified on the .env
        // if there is no other data saved
        saveInitialState() {
            if (localStorage.getItem('tmdb-key') === null && process.env.TMDB_KEY) {
                localStorage.setItem('tmdb-key', process.env.TMDB_KEY);
            }

            if (localStorage.getItem('client-type') === null && process.env.DEFAULT_CLIENT) {
                localStorage.setItem('client-type', process.env.DEFAULT_CLIENT);
            }

            if (localStorage.getItem('provider-service') === null && process.env.DEFAULT_PROVIDER) {
                localStorage.setItem('provider-service', process.env.DEFAULT_PROVIDER);
            }
        },
    },
    beforeMount() {
        // Initial state
        this.saveInitialState();

        // Load TMDB api key
        var key = localStorage.getItem('tmdb-key');
        if (key) {
            this.tmdb = new TheMovieDBCacheProxy(key);
        }

        // Load the client
        var client = localStorage.getItem('client-type');
        if (client && clients[client]) {
            this.client = new clients[client]();
            this.client.load();
        }

        // Load the provider
        var provider = localStorage.getItem('provider-service');
        if (provider && providers[provider]) {
            this.provider = new providers[provider]();
            this.provider.load();
        }
    },
}).$mount('#app');
