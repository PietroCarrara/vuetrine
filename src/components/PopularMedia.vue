<template>
    <div>
        <h3 class="py-2">Popular Movies</h3>
        <MediaQuery :query="popularMovies()" :component="MovieThumb"/>
        <h3 class="py-2">Popular Shows</h3>
        <MediaQuery :query="popularShows()" :component="ShowThumb"/>
    </div>
</template>

<script>
import tmdb from '../tmdb';
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
            return tmdb.movie.getPopular();
        },
        popularShows() {
            return tmdb.tv.getPopular();
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