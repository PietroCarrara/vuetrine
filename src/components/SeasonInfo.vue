<template>
    <div class="row">
        <div class="col-12 col-md-4 pb-4">
            <img v-if="poster" class="img-fluid rounded lifted" :src="poster" />
        </div>
        <div class="col-12 col-md-8">
            <h1>
                {{ seasonDetails.name }}
                <span class="text-muted">({{ year }})</span>
            </h1>
            <p>
                <router-link v-if="!showDetails.loading" :to="`/show/${showID}`">
                    Back to {{ showDetails.name }}
                </router-link>
            </p>
            <p class="text-justify">{{ seasonDetails.overview }}</p>
        </div>
        <div class="col-12">
            <div class="col-12 col-md-6">
                <EpisodeCard
                    v-for="episode in seasonDetails.episodes"
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
import tmdb from '../tmdb';
import EpisodeCard from './EpisodeCard.vue';
import IMDBLink from './IMDBLink.vue';
import MediaQuery from './MediaQuery.vue';
import TMDBLink from './TMDBLink.vue';
import YoutubeLink from './YoutubeLink.vue';

export default {
    name: 'SeasonInfo',
    components: {
        IMDBLink,
        MediaQuery,
        YoutubeLink,
        TMDBLink,
        EpisodeCard,
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
            seasonDetails: this.$root.getSeasonDetails(this.showID, this.seasonNumber),
            showDetails: this.$root.getShowDetails(this.showID),
            selectedEpisode: -1,
        };
    },
    watch: {
        showID(showID) {
            this.seasonDetails = this.$root.getSeasonDetails(showID, this.seasonNumber);
        },
        seasonNumber(seasonNumber) {
            this.seasonDetails = this.$root.getSeasonDetails(this.showID, seasonNumber);
        },
    },
    computed: {
        poster() {
            if (this.seasonDetails.loading || !this.seasonDetails.poster_path) {
                return '';
            }

            return tmdb.common.getImageUrl(
                this.seasonDetails.poster_path,
                'w500'
            );
        },
        year() {
            if (this.seasonDetails.loading || !this.seasonDetails.air_date) {
                return '';
            }

            return new Date(this.seasonDetails.air_date).getFullYear();
        },
    },
    methods: {
        select(episode) {
            if (this.selectedEpisode == episode.id) {
                this.selectedEpisode = -1;
            } else {
                this.selectedEpisode = episode.id;
            }
        },
    },
}
</script>