<template>
    <div>
        <router-link :to="`/movie/${id}`" class="text-decoration-none" style="color: inherit">
            <MediaThumb
                :loading="movieDetails.loading"
                :poster="poster"
                :title="movieDetails.title"
                :subtitle="year"
            />
        </router-link>
    </div>
</template>

<script>
import MediaThumb from './MediaThumb.vue';

export default {
    name: 'MovieThumb',
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
            movieDetails: this.$root.getMovieDetails(this.id),
        };
    },
    computed: {
        poster() {
            if (this.movieDetails.loading || !this.movieDetails.poster_path) {
                return '';
            }

            return this.$root.getImageUrl(
                this.movieDetails.poster_path,
                'w500'
            );
        },
        year() {
            if (this.movieDetails.loading || !this.movieDetails.release_date) {
                return '';
            }

            return new Date(this.movieDetails.release_date).getFullYear();
        },
    },
};
</script>
