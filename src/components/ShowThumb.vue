<template>
    <div>
        <router-link :to="`/show/${id}`" class="text-decoration-none" style="color: inherit">
            <MediaThumb
                :loading="showDetails.loading"
                :poster="poster"
                :title="showDetails.name"
                :subtitle="year"
            />
        </router-link>
    </div>
</template>

<script>
import tmdb from '../tmdb.js';
import MediaThumb from './MediaThumb.vue';

export default {
    name: 'ShowThumb',
    components: {
        MediaThumb,
    },
    props: {
        id: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            showDetails: this.$root.getShowDetails(this.id),
        };
    },
    computed: {
        poster() {
            if (this.showDetails.loading || !this.showDetails.poster_path) {
                return '';
            }

            return tmdb.common.getImageUrl(
                this.showDetails.poster_path,
                'w500'
            );
        },
        year() {
            if (this.showDetails.loading) {
                return '';
            }

            return new Date(this.showDetails.first_air_date).getFullYear();
        },
    },
};
</script>
