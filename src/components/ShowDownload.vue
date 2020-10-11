<template>
    <div>
        <MiniCard>
            <LoadingSpinner
                v-if="seasonDetails.loading || showDetails.loading"
                style="padding-top: 150px"
            ></LoadingSpinner>
            <div v-else>
                <router-link
                    :to="`/show/${this.download.info.tmdb}`"
                    class
                    style
                >
                    <div style="height: 300px">
                        <img
                            v-if="poster"
                            :src="poster"
                            class="mini-card-cover-img rounded-top"
                        />
                        <h4 v-else class="text-center pt-4">No Poster.</h4>
                    </div>
                </router-link>
                <div class="p-3">
                    <div class="text-center text-truncate h5">
                        {{ showDetails.data.name }}
                    </div>
                    <div>
                        <span class="text-muted h6">{{ subtitle }}</span>
                        <div
                            v-if="download.size"
                            class="float-right badge badge-secondary"
                        >
                            {{ download.size | size }}
                        </div>
                    </div>
                    <div class="row p-2">
                        <div class="progress col-12 p-0" style="height: 5px">
                            <div
                                v-bind:class="{
                                    'bg-success':
                                        download.status == 'downloading',
                                    'bg-secondary': download.status == 'paused',
                                }"
                                class="progress-bar"
                                role="progressbar"
                                :style="`width: ${download.completion * 100}%;`"
                                :aria-valuenow="download.completion * 100"
                                aria-valuemin="0"
                                aria-valuemax="100"
                            ></div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-3 small m-auto">
                            <div class="row pl-3">
                                {{ (download.completion * 100).toFixed(2) }}%
                            </div>
                        </div>
                        <div class="col-9 text-right">
                            <a
                                v-if="download.status == 'paused'"
                                v-on:click="toggleStatus(download)"
                                class="ml-2 btn btn-primary"
                                role="button"
                            >
                                <i class="zmdi zmdi-play"></i>
                            </a>
                            <a
                                v-if="download.status == 'downloading'"
                                v-on:click="toggleStatus(download)"
                                class="ml-2 btn btn-secondary"
                                role="button"
                            >
                                <i class="zmdi zmdi-pause"></i>
                            </a>
                            <a
                                class="ml-2 btn btn-danger"
                                role="button"
                                v-on:click="removeDownload(download)"
                            >
                                <i class="zmdi zmdi-delete"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </MiniCard>
    </div>
</template>

<script>
import { Download } from '../clients/client';
import LoadingSpinner from './LoadingSpinner.vue'
import MiniCard from './MiniCard.vue'


export default {
    name: 'ShowDownload',
    components: {
        LoadingSpinner,
        MiniCard,
    },
    props: {
        download: {
            type: Download,
            required: true,
        },
    },
    data() {
        return {
            showDetails: {
                loading: true,
                data: null,
            },
            seasonDetails: {
                loading: true,
                data: null,
            },
        };
    },
    computed: {
        subtitle() {
            if (this.download.info.isFullSeason) {
                return 'Season ' + this.download.info.season;
            }

            var season = ('00' + this.download.info.season).slice(-2);
            var episode = ('00' + this.download.info.episode).slice(-2);

            return `S${season}E${episode}`;
        },
        poster() {
            if (this.seasonDetails.loading) {
                return '';
            }

            return this.$root.tmdb.common.getImageUrl(this.seasonDetails.data.poster_path, 'w500');
        },
    },
    methods: {
        toggleStatus(download) {
            this.$emit('toggle-status', download);
        },
        removeDownload(download) {
            this.$emit('remove-download', download);
        },
    },
    mounted() {
        this.$root.tmdb.tv.getSimpleDetails(this.download.info.tmdb)
            .then(tv => {
                this.showDetails.data = tv;
                this.showDetails.loading = false;
            });

        this.$root.tmdb.tv.getSeasonDetails(this.download.info.tmdb, this.download.info.season)
            .then(s => {
                this.seasonDetails.data = s;
                this.seasonDetails.loading = false;
            });
    },
}
</script>