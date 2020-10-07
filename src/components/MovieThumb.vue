<template>
    <div>
        <router-link :to="`/movie/${id}`" class="text-decoration-none" style="color: inherit">
                <MediaThumb
                    v-if="!movieDetails.loading"
                    :poster="poster"
                    :title="movieDetails.data.title"
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
            movieDetails: {
                loading: true,
                data: null,
            }
        };
    },
    computed: {
        poster() {
            if (this.movieDetails.loading || !this.movieDetails.data.poster_path) {
                return '';
            }

            return this.$root.getImageUrl(
                this.movieDetails.data.poster_path,
                'w500'
            );
        },
        year() {
            if (this.movieDetails.loading || !this.movieDetails.data.release_date) {
                return '';
            }

            return new Date(this.movieDetails.data.release_date).getFullYear();
        },
    },
    mounted() {
        this.movieDetails.loading = true;
        this.movieDetails.data = null;

        this.$root.tmdb.movie.getSimpleDetails(this.id)
        .then(m => {
            this.movieDetails.data = m;
            this.movieDetails.loading = false;
        });
    }
};
</script>
