<template>
    <div class="row">
        <div class="col-12 col-md-4 pb-4">
            <img v-if="poster" class="img-fluid rounded lifted" :src="poster"/>
        </div>
        <div class="col-12 col-md-8">
            <h1>{{ movieDetails.title }} <span class="text-muted">({{ year }})</span></h1>
            <p :v-if="movieDetails.tagline != ''" class="text-muted">{{movieDetails.tagline}}</p>
            <p class="text-justify">{{ movieDetails.overview }}</p>
            <div class="text-right">
                <IMDBLink v-if="movieDetails.imdb_id" :id="movieDetails.imdb_id"/>
            </div>
            <hr/>
            <div>
                <h5>You might also like:</h5>
                <MediaQuery v-if="related != null" v-bind:query="related" :component="MovieThumb"/>
            </div>
        </div>
    </div>
</template>

<script>
import tmdb from '../tmdb';
import IMDBLink from './IMDBLink.vue';
import MediaQuery from './MediaQuery.vue';
import MovieThumb from './MovieThumb.vue';

export default {
    name: 'MovieInfo',
    components: {
        IMDBLink,
        MediaQuery,
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
            related: null,
            MovieThumb,
        };
    },
    watch: {
        id(id) {
            this.movieDetails = this.$root.getMovieDetails(id);
            this.related = tmdb.movie.getRecommended(id);
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
    },
    mounted() {
        this.related = tmdb.movie.getRecommended(this.id);
    }
}
</script>