<template>
    <a
        class="btn btn-tmdb"
        role="button"
        :href="`https://www.themoviedb.org/movie/${id}`"
        target="_blank"
    >
        <span class="tmdb">
            TMDB
            <i class="zmdi zmdi-movie-alt"></i>
        </span>
    </a>
</template>

<script>
export default {
    name: 'TMDBLink',
    props: {
        id: {
            type: Number,
            required: true,
        },
    },
}
</script>

<style scoped>
.btn-tmdb {
    background-color: #032541;
}
.tmdb {
    background: linear-gradient(
        to right,
        rgba(192, 254, 207, 1) 0%,
        rgba(30, 213, 169, 1) 100%
    );
    /* background-clip: ; */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>