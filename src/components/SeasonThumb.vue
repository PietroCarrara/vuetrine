<template>
    <router-link :to="`/show/${showid}/season/${season.season_number}`" class="text-decoration-none" style="color: inherit">
        <MediaThumb :poster="poster" :title="season.name" :subtitle="`${year ? year + ' - ': ''}${season.episode_count} episodes`" />
    </router-link>
</template>

<script>
import MediaThumb from './MediaThumb.vue';

export default {
    name: 'SeasonThumb',
    components: {
        MediaThumb,
    },
    props: {
        showid: {
            type: Number,
            required: true,
        },
        season: {
            type: Object,
            required: true,
        },
    },
    computed: {
        poster() {
            if (!this.season.poster_path) {
                return '';
            }

            return this.$root.getImageUrl(this.season.poster_path, 'w500');
        },
        year() {
            if (!this.season.air_date) {
                return '';
            }

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