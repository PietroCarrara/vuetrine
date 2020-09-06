<template>
    <div class="movie-thumb rounded">
        <LoadingSpinner v-if="movieDetails.loading"></LoadingSpinner>
        <div v-else>
            <img :src="poster"
                class="movie-thumb-img rounded-top"
            />
            <div class="card-body">
                <h5 class="text-truncate">{{ movieDetails.title }}</h5>
                <h6 class="text-muted">{{ movieDetails.release_date | date | year }}</h6>
            </div>
        </div>
    </div>
</template>

<script>
import LoadingSpinner from "./LoadingSpinner.vue";
import tmdb from '../tmdb.js';

export default {
    name: "MovieThumb",
    components: {
        LoadingSpinner,
    },
    props: {
        movieID: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            movieDetails: this.$root.getMovieDetails(this.movieID),
        };
    },
    computed: {
        poster() {
            if (this.movieDetails.loading) {
                return '';
            }

            return tmdb.common.getImageUrl(this.movieDetails.poster_path, 'w500');
        },
    },
    filters: {
        date(str) {
            return new Date(str);
        },
        year(date) {
            return date.getFullYear();
        },
    },
};
</script>

<style>
.movie-thumb {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.75);
    border: 0;
    width: 200px;
    height: 400px;
}
.movie-thumb-img {
    object-fit: cover;
    max-width: 100%;
    max-height: 100%;
}
</style>