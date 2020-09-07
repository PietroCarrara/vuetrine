<template>
    <div class="row">
        <div class="col-12 col-md-4 pb-4">
            <img v-if="poster" class="img-fluid rounded lifted" :src="poster"/>
        </div>
        <div class="col-12 col-md-8">
            <h1>{{ showDetails.name }} <span class="text-muted">({{ year }})</span></h1>
            <p class="text-justify">{{ showDetails.overview }}</p>
            <div class="text-right">
                <YoutubeLink v-if="trailer" class="mx-1" :id="trailer" text="Trailer"/>
                <TMDBLink class="mx-1" type="tv" :id="showDetails.id"/>
                <IMDBLink v-if="imdbID" class="mx-1" :id="imdbID"/>
            </div>
            <hr/>
            <div>
                <h5>You might also like:</h5>
                <MediaQuery v-if="related != null" v-bind:query="related" :component="ShowThumb"/>
            </div>
        </div>
    </div>
</template>

<script>
import tmdb from '../tmdb';
import IMDBLink from './IMDBLink.vue';
import MediaQuery from './MediaQuery.vue';
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
    },
    props: {
        id: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            showDetails: this.$root.getShowDetails(this.id),
            ShowThumb,
        };
    },
    watch: {
        id(id) {
            this.showDetails = this.$root.getShowDetails(id);
        },
    },
    computed: {
        poster() {
            if (this.showDetails.loading || !this.showDetails.poster_path) {
                return '';
            }

            return tmdb.common.getImageUrl(
                this.showDetails.poster_path,
                'w500'
            );
        },
        year() {
            if (this.showDetails.loading || !this.showDetails.first_air_date) {
                return '';
            }

            return new Date(this.showDetails.first_air_date).getFullYear();
        },
        related() {
            return tmdb.tv.getRecommended(this.showDetails.id).then(r => {
                if (r.response.results.length <= 0) {
                    return tmdb.movie.getSimilar(this.showDetails.id);
                } else {
                    return r;
                }
            });
        },

    },
    asyncComputed: {
        async imdbID() {
            return (await tmdb.tv.getExternalIDs(this.showDetails.id)).imdb_id;
        },
        trailer: {
            async get() {
                return tmdb.tv.getVideos(this.showDetails.id).then(r => {
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
}
</script>