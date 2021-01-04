<template>
    <a
        class="btn btn-rarbg"
        role="button"
        :href="href"
        target="_blank"
    >
        Rarbg
        <i class="zmdi zmdi-tv-alt-play"></i>
    </a>
</template>

<script>
export default {
    name: 'RarbgLink',
    props: {
        id: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            validator: (v) => ['movie', 'show'].includes(v),
        }
    },
    computed: {
        isMovie() {
            return this.type == 'movie';
        },
        isShow() {
            return this.type == 'show';
        },
        href() {
            if (this.isShow) {
                return `https://rarbgproxied.org/tv/${this.id}/`;
            }

            if (this.isMovie) {
                return `https://rarbgproxied.org/torrents.php?imdb=${this.id}/`;
            }

            return res;
        },
    },
}
</script>

<style scoped>
.btn-rarbg {
    color: #7597e7;
    background-color: #1f1f1f;
    border-color: #2f2f2f;

    /* -webkit-text-stroke-width: 1pt;
    -webkit-text-stroke-color: white; */
}
.btn-rarbg:hover {
    color: #3860bb;
    background-color: #393939;
    border-color: #494949;
}
</style>