<template>
    <a
        class="btn btn-imdb"
        role="button"
        :href="`https://www.imdb.com/title/${id}`"
        target="_blank"
    >
        IMDb
        <i class="zmdi zmdi-movie-alt"></i>
    </a>
</template>

<script>
export default {
    name: 'IMDBLink',
    props: {
        id: {
            type: String,
            required: true,
        },
    },
}
</script>

<style scoped>
.btn-imdb {
    background-color: #f5c518;
    border-color: #f5c518;
    color: black;
    font-weight: bold;
}
</style>