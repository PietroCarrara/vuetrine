<template>
    <div id="app">
        <MovieQuery :query="this.getPopular()" />
    </div>
</template>

<script>
import MovieQuery from './components/MovieQuery.vue';
import tmdb from './tmdb';

export default {
    name: "App",
    components: {
        MovieQuery,
    },
    methods: {
        getPopular() {
            return tmdb.movie.getPopular();
        }
    }
};
</script>
