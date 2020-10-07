<template>
    <div>
        <h3 class="py-2 text-center">Popular Movies</h3>
        <MediaQuery :query="popularMovies()" :component="MovieThumb" />
        <h3 class="py-2 text-center">Popular Shows</h3>
        <MediaQuery :query="popularShows()" :component="ShowThumb" />
    </div>
</template>

<script>
import MediaQuery from "./MediaQuery.vue";
import MovieThumb from './MovieThumb.vue';
import ShowThumb from './ShowThumb.vue';

export default {
    name: 'PopularMedia',
    components: {
        MediaQuery,
    },
    methods: {
        popularMovies() {
            return this.$root.tmdb.movie.getPopular();
        },
        popularShows() {
            return this.$root.getPopularShows();
        },
    },
    data() {
        return {
            MovieThumb,
            ShowThumb,
        };
    }
};
</script>