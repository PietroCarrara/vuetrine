<template>
    <a
        class="btn btn-youtube"
        role="button"
        :href="`https://youtube.com/watch?v=${id}`"
        target="_blank"
    >
        {{text}}
        <i class="zmdi zmdi-youtube-play"></i>
    </a>
</template>

<script>
export default {
    name: 'YoutubeLink',
    props: {
        id: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            default: 'Youtube',
        },
    },
}
</script>

<style scoped>
.btn-youtube {
    color: #fff;
    background-color: #f00;
    border-color: #ff7f7f;
}
.btn-youtube:hover {
    color: #fff;
    background-color: #d00;
    border-color: #e06060;
}
</style>