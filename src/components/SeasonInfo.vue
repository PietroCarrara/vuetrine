<template>
    <div v-if="seasonDetails.loading">
        <LoadingSpinner />
    </div>
    <div v-else class="row">
        <div class="col-12 col-md-4 pb-4">
            <img v-if="poster" class="img-fluid rounded lifted" :src="poster" />
        </div>
        <div class="col-12 col-md-8">
            <h1>
                {{ seasonDetails.data.name }}
                <span class="text-muted">({{ year }})</span>
            </h1>
            <p>
                <router-link
                    v-if="!showDetails.loading"
                    :to="`/show/${showID}`"
                >
                    Back to {{ showDetails.data.name }}
                </router-link>
            </p>
            <p class="text-justify">{{ overview }}</p>
        </div>
        <div class="col-12 col-md-6">
            <TorrentList
                v-on:download="downloadShowMagnet"
                :torrents="seasonTorrents"
            />
        </div>
        <div class="col-12 col-md-6">
            <div class="col-12">
                <div
                    v-for="episode in seasonDetails.data.episodes"
                    :key="episode.id"
                >
                    <EpisodeCard
                        :episode="episode"
                        :selected="episode.id == selectedEpisode"
                        v-on:clicked="select(episode)"
                        class="my-3"
                    >
                        <TorrentList
                            :torrents="episodeTorrents[episode.episode_number]"
                            v-on:download="
                                (m) =>
                                    downloadEpisodeMagnet(
                                        m,
                                        episode.episode_number
                                    )
                            "
                        />
                    </EpisodeCard>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { MediaInfo } from '../providers/provider';
import EpisodeCard from './EpisodeCard.vue';
import IMDBLink from './IMDBLink.vue';
import LoadingSpinner from './LoadingSpinner.vue';
import MediaQuery from './MediaQuery.vue';
import TMDBLink from './TMDBLink.vue';
import TorrentList from './TorrentList.vue';
import YoutubeLink from './YoutubeLink.vue';
import { DownloadInfo } from '../clients/client';


export default {
    name: 'SeasonInfo',
    components: {
        IMDBLink,
        MediaQuery,
        YoutubeLink,
        TMDBLink,
        EpisodeCard,
        LoadingSpinner,
        // BestTorrent,
        TorrentList,
    },
    props: {
        showID: {
            type: Number,
            required: true,
        },
        seasonNumber: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            seasonDetails: {
                loading: true,
                data: null,
            },
            showDetails: {
                loading: true,
                data: null,
            },
            selectedEpisode: -1,
            seasonTorrents: null,
            episodeTorrents: [],
        };
    },
    watch: {
        showID(showID) {
            this.loadData();
        },
        seasonNumber(seasonNumber) {
            this.loadData();
        },
    },
    computed: {
        poster() {
            if (this.seasonDetails.loading || !this.seasonDetails.data.poster_path) {
                return '';
            }

            return this.$root.tmdb.common.getImageUrl(this.seasonDetails.data.poster_path, 'w500');
        },
        year() {
            if (this.seasonDetails.loading || !this.seasonDetails.data.air_date) {
                return '';
            }

            return new Date(this.seasonDetails.data.air_date).getFullYear();
        },
        overview() {
            if (this.seasonDetails.loading) {
                return '';
            }

            if (this.seasonDetails.data.overview) {
                return this.seasonDetails.data.overview;
            }

            if (this.showDetails.loading) {
                return '';
            }

            return this.showDetails.data.overview;
        }
    },
    methods: {
        loadData() {
            this.showDetails.loading = true;
            this.showDetails.data = null;

            this.seasonDetails.loading = true;
            this.seasonDetails.data = null;

            this.$root.tmdb.tv.getDetails(this.showID)
                .then(tv => {
                    this.showDetails.data = tv;
                    this.showDetails.loading = false;
                });

            this.$root.tmdb.tv.getSeasonDetails(this.showID, this.seasonNumber)
                .then(s => {
                    this.seasonDetails.loading = false;
                    this.seasonDetails.data = s;
                    this.reloadSeasonTorrents();
                });
        },
        select(episode) {
            if (this.selectedEpisode == episode.id) {
                this.selectedEpisode = -1;
            } else {
                this.selectedEpisode = episode.id;

                if (!this.episodeTorrents[episode.episode_number]) {
                    this.reloadEpisodeTorrents(episode.episode_number);
                }
            }
        },
        async reloadSeasonTorrents() {
            this.seasonTorrents = null;

            var ids = await this.$root.tmdb.tv.getExternalIDs(this.showID);

            var info = new MediaInfo({
                imdb: ids.imdb_id,
                type: 'show',
                title: this.showDetails.loading ? undefined : this.showDetails.data.name,
                year: this.year,
                isEntireSeason: true,
                season: this.seasonNumber,
            });

            var magnets = await this.$root.showProvider.getMagnets(info)

            this.seasonTorrents = magnets.response;
        },
        async reloadEpisodeTorrents(episodeNumber) {
            this.episodeTorrents[episodeNumber] = null;

            var ids = await this.$root.tmdb.tv.getExternalIDs(this.showID);

            var info = new MediaInfo({
                imdb: ids.imdb_id,
                type: 'show',
                title: this.seasonDetails.loading ? '' : this.showDetails.data.name,
                year: this.year,
                isEntireSeason: false,
                season: this.seasonNumber,
                episode: episodeNumber,
            });

            var magnets = await this.$root.showProvider.getMagnets(info);
            Vue.set(this.episodeTorrents, episodeNumber, magnets.response);
        },
        downloadShowMagnet(magnet) {
            if (this.seasonDetails.loading) {
                return;
            }

            var info = new DownloadInfo({
                tmdb: this.showID,
                type: 'show',
                title: this.showDetails.data.name,
                year: this.year,
                season: this.seasonNumber,
                isEntireSeason: true,
            });
            this.$root.client.downloadMagnet(magnet.link, info);
            this.$router.push('/downloads');
        },
        downloadEpisodeMagnet(magnet, episodeNumber) {
            if (this.seasonDetails.loading) {
                return;
            }

            var info = new DownloadInfo({
                tmdb: this.showID,
                type: 'show',
                title: this.showDetails.data.name,
                year: this.year,
                season: this.seasonNumber,
                isEntireSeason: false,
                episode: episodeNumber,
            });
            this.$root.client.downloadMagnet(magnet.link, info);
            this.$router.push('/downloads');
        }
    },
    mounted() {
        this.loadData();
    }
}
</script>