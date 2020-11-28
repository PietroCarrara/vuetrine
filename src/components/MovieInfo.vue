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

                        <div class="col-12 mt-3 p-0">
                            <div class="row">
                                <div class="col-10">
                                    <input
                                        type="text"
                                        placeholder="Import custom magnet"
                                        class="form-control mr-2"
                                        v-model="customMagnet"
                                    />
                                </div>
                                <div class="col-2 pl-0">
                                    <button
                                        class="btn btn-outline-success"
                                        v-on:click="
                                            downloadTorrent({
                                                link: customMagnet,
                                            })
                                        "
                                    >
                                        <i class="zmdi zmdi-download"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <BestTorrent
                        v-on:download="downloadTorrent"
                        v-on:reload="reloadTorrents"
                        :torrents="torrents"
                        :reloadinEnabled="true"
                    />
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
        <TorrentList
            v-if="torrents !== null && torrents.length > 0"
            v-on:download="downloadTorrent"
            :torrents="torrents"
        />
    </div>
</template>

<script>
import { DownloadInfo } from '../clients/client';
import { MediaInfo } from '../providers/provider';
import BestTorrent from './BestTorrent.vue';
import IMDBLink from './IMDBLink.vue';
import LoadingSpinner from './LoadingSpinner.vue';
import MediaQuery from './MediaQuery.vue';
import MovieThumb from './MovieThumb.vue';
import TMDBLink from './TMDBLink.vue';
import TorrentList from './TorrentList.vue';
import YoutubeLink from './YoutubeLink.vue';

export default {
    name: 'MovieInfo',
    components: {
        IMDBLink,
        MediaQuery,
        YoutubeLink,
        TMDBLink,
        LoadingSpinner,
        BestTorrent,
        TorrentList,
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
            customMagnet: '',
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

            this.$root.movieProvider.getMagnets(new MediaInfo({
                imdb: this.movieDetails.data.imdb_id,
                type: 'movie',
                title: this.movieDetails.data.title,
                year: this.year,
            }))
                .then(r => {
                    this.torrents = r.response;
                    this.nextTorrentPage = r.next;
                });
        },
        downloadTorrent(torrent) {
            if (this.movieDetails.loading) {
                return;
            }

            var info = new DownloadInfo({
                tmdb: this.id,
                type: 'movie',
                title: this.movieDetails.data.title,
                year: this.year,
            });

            this.$root.client.downloadMagnet(torrent.link, info);
            this.$router.push('/downloads');
        },
    }
}
</script>
