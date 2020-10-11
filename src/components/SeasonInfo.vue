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
            <TorrentList v-on:download="downloadMagnet" :torrents="seasonTorrents" />
        </div>
        <div class="col-12 col-md-6">
            <div class="col-12">
                <EpisodeCard
                    v-for="episode in seasonDetails.data.episodes"
                    :key="episode.id"
                    :episode="episode"
                    :selected="episode.id == selectedEpisode"
                    v-on:clicked="select(episode)"
                    class="my-3"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { MediaInfo } from '../providers/provider';
import { DownloadInfo } from '../clients/client';
// import BestTorrent from './BestTorrent.vue';
import EpisodeCard from './EpisodeCard.vue';
import IMDBLink from './IMDBLink.vue';
import LoadingSpinner from './LoadingSpinner.vue';
import MediaQuery from './MediaQuery.vue';
import TMDBLink from './TMDBLink.vue';
import TorrentList from './TorrentList.vue';
import YoutubeLink from './YoutubeLink.vue';


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
            }
        },
        async reloadSeasonTorrents() {
            this.seasonTorrents = null;
            if (this.showDetails.loading) {
                return;
            }

            var ids = await this.$root.tmdb.tv.getExternalIDs(this.showID);

            var info = new MediaInfo({
                imdb: ids.imdb_id,
                type: 'show',
                title: this.showDetails.data.name,
                year: this.year,
                isEntireSeason: true,
                season: this.seasonNumber,
            });

            var magnets = await this.$root.showProvider.getMagnets(info)

            this.seasonTorrents = magnets.response;
        },
        downloadMagnet(magnet) {
            var info = new DownloadInfo(this.showID, 'show', this.seasonNumber, true);
            this.$root.client.downloadMagnet(magnet.link, info);
            // this.$router.push('/downloads');
        },
    },
    mounted() {
        this.loadData();
    }
}
</script>