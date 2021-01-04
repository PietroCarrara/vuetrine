<template>
    <div v-if="showDetails.loading">
        <LoadingSpinner />
    </div>
    <div v-else class="row">
        <div class="col-12 col-md-4 pb-4">
            <img v-if="poster" class="img-fluid rounded lifted" :src="poster" />
        </div>
        <div class="col-12 col-md-8">
            <h1>
                {{ showDetails.data.name }}
                <span class="text-muted">({{ year }})</span>
            </h1>
            <p class="text-justify">{{ showDetails.data.overview }}</p>
            <div class="text-right">
                <YoutubeLink
                    v-if="trailer"
                    class="mx-1"
                    :id="trailer"
                    text="Trailer"
                />
                <TMDBLink class="mx-1" type="tv" :id="id" />
                <IMDBLink v-if="imdbID" class="mx-1" :id="imdbID" />
                <RarbgLink
                    v-if="imdbID"
                    class="mx-1"
                    :id="imdbID"
                    type="show"
                />
            </div>

            <div class="col-12">
                <hr />
                <h4>Seasons:</h4>
                <HorizontalScroll>
                    <SeasonThumb
                        v-for="season of seasons"
                        :key="season.id"
                        :season="season"
                        :showid="id"
                        class="mx-2 my-2"
                    />

                    <div style="width: 0.5rem"></div>
                </HorizontalScroll>
            </div>
        </div>
        <div class="col-12">
            <hr />
            <h5>You might also like:</h5>
            <MediaQuery
                v-if="related != null"
                v-bind:query="related"
                :component="ShowThumb"
            />
        </div>
    </div>
</template>

<script>
import HorizontalScroll from './HorizontalScroll.vue';
import IMDBLink from './IMDBLink.vue';
import LoadingSpinner from './LoadingSpinner.vue';
import MediaQuery from './MediaQuery.vue';
import RarbgLink from './RarbgLink.vue';
import SeasonThumb from './SeasonThumb.vue';
import ShowThumb from './ShowThumb.vue';
import TMDBLink from './TMDBLink.vue';
import YoutubeLink from './YoutubeLink.vue';



export default {
    name: 'ShowInfo',
    components: {
        IMDBLink,
        MediaQuery,
        YoutubeLink,
        TMDBLink,
        SeasonThumb,
        HorizontalScroll,
        LoadingSpinner,
        RarbgLink,
    },
    props: {
        id: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            showDetails: {
                loading: true,
                data: null,
            },
            ShowThumb,
        };
    },
    watch: {
        id(id) {
            this.loadData();
        },
    },
    computed: {
        poster() {
            if (this.showDetails.loading || !this.showDetails.data.poster_path) {
                return '';
            }

            return this.$root.tmdb.common.getImageUrl(this.showDetails.data.poster_path, 'w500');
        },
        year() {
            if (this.showDetails.loading || !this.showDetails.data.first_air_date) {
                return '';
            }

            return new Date(this.showDetails.data.first_air_date).getFullYear();
        },
        related() {
            return this.$root.tmdb.tv.getRecommended(this.showDetails.data.id).then(r => {
                if (r.response.results.length <= 0) {
                    return this.$root.tmdb.tv.getSimilar(this.showDetails.data.id);
                } else {
                    return r;
                }
            });
        },
        seasons() {
            if (this.showDetails.data.loading || !this.showDetails.data.seasons) {
                return [];
            }

            return this.showDetails.data.seasons.sort((a, b) => a.season_number - b.season_number).reverse();
        }
    },
    asyncComputed: {
        async imdbID() {
            return (await this.$root.tmdb.tv.getExternalIDs(this.id)).imdb_id;
        },
        trailer: {
            async get() {
                return this.$root.tmdb.tv.getVideos(this.id).then(r => {
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
        }
    },
    methods: {
        loadData() {
            this.showDetails.loading = true;
            this.showDetails.data = null;

            this.$root.tmdb.tv.getDetails(this.id)
                .then(tv => {
                    this.showDetails.data = tv;
                    this.showDetails.loading = false;
                });
        },
    },
    mounted() {
        this.loadData();
    },
}
</script>