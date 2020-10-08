import Vue from 'vue'
import App from './App.vue'
import router from './router'
import AsyncComputed from 'vue-async-computed'
import { TheMovieDBCacheProxy } from './tmdb/tmdbcache.js'
import { clients } from './clients/clients';
import providers from './providers/providers'

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
            provider: new providers['yts'](),
            client: new clients['transmission'](),
            tmdb: new TheMovieDBCacheProxy(process.env.TMDB_KEY),
        };
    },
    router,
    methods: {
        bestMagnet,
    },
    mounted() {
        // TODO: Do this in a proper place
        this.client.config();
    }
}).$mount('#app');
