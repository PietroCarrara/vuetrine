<template>
    <a class="btn btn-primary btn-imdb" :href="`https://www.imdb.com/title/${id}`" target="_blank">
        IMDb
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