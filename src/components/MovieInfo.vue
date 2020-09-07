<template>
    <div class="row">
        <div class="col-12 col-md-4 pb-4">
            <img v-if="poster" class="img-fluid rounded lifted" :src="poster" />
        </div>
        <div class="col-12 col-md-8">
            <h1>
                {{ movieDetails.title }}
                <span class="text-muted">({{ year }})</span>
            </h1>
            <p :v-if="movieDetails.tagline != ''" class="text-muted">{{movieDetails.tagline}}</p>
            <p class="text-justify">{{ movieDetails.overview }}</p>
            <div class="text-right">
                <YoutubeLink v-if="trailer" class="mx-1" :id="trailer" text="Trailer" />
                <TMDBLink class="mx-1" type="movie" :id="movieDetails.id" />
                <IMDBLink v-if="movieDetails.imdb_id" class="mx-1" :id="movieDetails.imdb_id" />
            </div>
            <hr />
            <div>
                <h5>You might also like:</h5>
                <MediaQuery v-if="related != null" v-bind:query="related" :component="MovieThumb" />
            </div>
        </div>
    </div>
</template>

<script>
import tmdb from '../tmdb';
import IMDBLink from './IMDBLink.vue';
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
    },
    props: {
        id: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            movieDetails: this.$root.getMovieDetails(this.id),
            MovieThumb,
        };
    },
    watch: {
        id(id) {
            this.movieDetails = this.$root.getMovieDetails(id);
        },
    },
    computed: {
        poster() {
            if (this.movieDetails.loading || !this.movieDetails.poster_path) {
                return '';
            }

            return tmdb.common.getImageUrl(
                this.movieDetails.poster_path,
                'w500'
            );
        },
        year() {
            if (this.movieDetails.loading || !this.movieDetails.release_date) {
                return '';
            }

            return new Date(this.movieDetails.release_date).getFullYear();
        },
        related() {
            return tmdb.movie.getRecommended(this.movieDetails.id).then(r => {
                if (r.response.results.length <= 0) {
                    return tmdb.movie.getSimilar(this.movieDetails.id);
                } else {
                    return r;
                }
            });
        },
    },
    asyncComputed: {
        trailer: {
            async get() {
                return tmdb.movie.getVideos(this.movieDetails.id).then(r => {
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