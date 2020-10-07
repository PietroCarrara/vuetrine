<template>
    <div v-if="movieDetails.loading">
        <LoadingSpinner />
    </div>
    <div v-else>
        <div class="row">
            <div class="col-12 col-md-4 pb-4">
                <img
                    v-if="poster"
                    class="img-fluid rounded lifted"
                    :src="poster"
                />
            </div>
            <div class="col-12 col-md-8">
                <h1>
                    {{ movieDetails.data.title }}
                    <span v-if="year" class="text-muted">({{ year }})</span>
                </h1>
                <p :v-if="movieDetails.data.tagline != ''" class="text-muted">
                    {{ movieDetails.data.tagline }}
                </p>
                <p class="text-justify">{{ movieDetails.data.overview }}</p>
                <div class="row">
                    <div class="col-12 col-lg-6 mt-3">
                        <YoutubeLink
                            v-if="trailer"
                            class="mx-1"
                            :id="trailer"
                            text="Trailer"
                        />
                        <TMDBLink
                            class="mx-1"
                            type="movie"
                            :id="movieDetails.data.id"
                        />
                        <IMDBLink
                            v-if="movieDetails.data.imdb_id"
                            class="mx-1"
                            :id="movieDetails.data.imdb_id"
                        />
                    </div>
                    <div class="col-12 col-lg-6 mt-3 text-center">
                        <div v-if="torrents == null" class="font-weight-bold">
                            Searching torrents...
                            <LoadingSpinner class="mt-1" />
                        </div>
                        <div
                            v-else-if="torrents.length <= 0"
                            class="font-weight-bold"
                        >
                            We couldn't find any torrents.
                        </div>
                        <a
                            v-else-if="bestMagnet != null"
                            v-on:click="
                                downloadTorrent(bestMagnet, movieDetails.data)
                            "
                            class="btn btn-block btn-success font-weight-bold"
                        >
                            {{ bestMagnet.size | size }}
                            <i class="zmdi zmdi-download"></i>
                        </a>
                    </div>
                </div>
                <hr />
                <div>
                    <h5>You might also like:</h5>
                    <MediaQuery
                        v-if="related != null"
                        v-bind:query="related"
                        :component="MovieThumb"
                    />
                </div>
            </div>
        </div>
        <div class="row" v-if="torrents != null && torrents.length > 0">
            <div class="col-12">
                <hr />
                <h4>Download Options:</h4>

                <div class="col-12 pr-0">
                    <div
                        v-for="torrent of torrents"
                        :key="torrent.link"
                        class="row col-12 py-3 striped"
                    >
                        <div>
                            <a
                                role="button"
                                class="btn btn-success badge mr-1"
                                v-on:click="
                                    downloadTorrent(torrent, movieDetails.data)
                                "
                            >
                                <i class="zmdi zmdi-download"></i>
                            </a>
                            <span
                                class="badge py-1 badge-secondary torrent-info"
                                >{{ torrent.size | size }}</span
                            >
                        </div>
                        <div class="text-truncate col">{{ torrent.title }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { DownloadInfo } from '../clients/client';
import { MediaInfo } from '../providers/provider';
import IMDBLink from './IMDBLink.vue';
import LoadingSpinner from './LoadingSpinner.vue';
import MediaQuery from './MediaQuery.vue';
import MovieThumb from './MovieThumb.vue';
import TMDBLink from './TMDBLink.vue';
import YoutubeLink from './YoutubeLink.vue';

export default {
    name: 'MovieInfo',
    components: {
        IMDBLink,
        MediaQuery,
        YoutubeLink,
        TMDBLink,
        LoadingSpinner,
    },
    props: {
        id: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            movieDetails: {
                loading: true,
                data: null,
            },
            torrents: null,
            nextTorrentPage: null,
            MovieThumb,
        };
    },
    watch: {
        id() {
            this.loadData();
        },
    },
    computed: {
        poster() {
            if (this.movieDetails.loading || !this.movieDetails.data.poster_path) {
                return '';
            }

            return this.$root.tmdb.common.getImageUrl(this.movieDetails.data.poster_path, 'w500');
        },
        year() {
            if (this.movieDetails.loading || !this.movieDetails.data.release_date) {
                return '';
            }

            return new Date(this.movieDetails.data.release_date).getFullYear();
        },
        related() {
            return this.$root.tmdb.movie.getRecommended(this.movieDetails.data.id).then(r => {
                if (r.response.results.length <= 0) {
                    return this.$root.tmdb.movie.getSimilar(this.movieDetails.data.id);
                } else {
                    return r;
                }
            });
        },
        bestMagnet() {
            if (this.torrents == null) {
                return null;
            }

            return this.$root.bestMagnet(this.torrents);
        }
    },
    asyncComputed: {
        trailer: {
            get() {
                if (this.movieDetails.loading) {
                    return;
                }

                return this.$root.tmdb.movie.getVideos(this.movieDetails.data.id).then(r => {
                    var res = null;
                    for (var video of r.results) {
                        if (video.site.toLowerCase() == 'youtube') {
                            if (res == null || (res.type != 'Trailer' && video.type == 'Trailer')) {
                                res = video;
                            }
                        }
                    }
                    res = res || {};
                    return res.key || '';
                });
            },
            default: '',
        },
    },
    mounted() {
        this.loadData();
    },
    methods: {
        loadData() {
            this.movieDetails.loading = true;
            this.torrents = null;

            this.$root.tmdb.movie.getDetails(this.id)
                .then(m => {
                    this.movieDetails.data = m;
                    this.movieDetails.loading = false;
                    this.reloadTorrents();
                })
        },
        reloadTorrents() {
            this.torrents = null;
            if (this.movieDetails.loading) {
                return;
            }

            this.$root.provider.getMagnets(new MediaInfo({
                imdb: this.movieDetails.data.imdb_id
            }))
                .then(r => {
                    this.torrents = r.response;
                    this.nextTorrentPage = r.next;
                });
        },
        downloadTorrent(torrent, movie) {
            var info = new DownloadInfo(movie.id, 'movie');
            this.$root.client.downloadMagnet(torrent.link, info);
            this.$router.push('/downloads');
        },
    }
}
</script>

<style scoped>
.striped:nth-child(even) {
    background-color: #f8f9fa;
}
.torrent-info {
    width: 6em;
}
</style>