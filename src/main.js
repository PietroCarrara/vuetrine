import Vue from 'vue'
import App from './App.vue'
import router from './router'
import AsyncComputed from 'vue-async-computed'
import TheMovieDB from './tmdb/tmdb.js'
import { YTSProvider } from './providers/yts/provider'
import { MediaInfo, TorrentMagnet } from './providers/provider'
import { DownloadInfo } from './clients/client'
import { clients } from './clients/clients';

Vue.config.productionTip = false;

Vue.use(AsyncComputed);

const tmdb = new TheMovieDB(process.env.TMDB_KEY);

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

new Vue({
    render: h => h(App),
    data: () => {
        return {
            movieDetails: {},
            showDetails: {},
            seasonDetails: {},
            provider: new YTSProvider(),
            client: new clients['transmission'](),
        };
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
        /**
         * Returns a list of magnets of a movie
         * @param {Object} movie A movie object
         */
        getMovieTorrents(movie) {
            const info = new MediaInfo({
                imdb: movie.imdb_id,
            });

            return this.provider.getMagnets(info);
        },
        getShowTorrents(show) {
            // TODO: implement
        },
        bestMagnet,
        /**
         *
         * @param {TorrentMagnet} magnet
         */
        downloadMovieMagnet(magnet, movie) {
            var info = new DownloadInfo(movie.id, 'movie');
            this.client.downloadMagnet(magnet.link, info);
        },
        downloadShowMagnet(magnet, show, season, episode, isFullSeason) {
            // TODO: implement
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
