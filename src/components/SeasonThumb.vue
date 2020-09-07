<template>
    <router-link :to="`/season/${season.id}`" class="text-decoration-none" style="color: inherit">
        <MediaThumb :poster="poster" :title="season.name" :subtitle="` ${year} - ${season.episode_count} episodes`" />
    </router-link>
</template>

<script>
import tmdb from '../tmdb'
import MediaThumb from './MediaThumb.vue';

export default {
    name: 'SeasonThumb',
    components: {
        MediaThumb,
    },
    props: {
        season: {
            type: Object,
            required: true,
        },
    },
    computed: {
        poster() {
            return tmdb.common.getImageUrl(this.season.poster_path, 'w500');
        },
        year() {
            return new Date(this.season.air_date).getFullYear();
        }
    }
}
</script>

<style scoped>
.poster {
    object-fit: cover;
    width: 100%;
    height: 100%;
}
</style>