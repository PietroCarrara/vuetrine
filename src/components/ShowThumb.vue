<template>
    <div>
        <router-link :to="`/show/${id}`" class="text-decoration-none" style="color: inherit">
            <MediaThumb
                v-if="!showDetails.loading"
                :loading="showDetails.loading"
                :poster="poster"
                :title="showDetails.data.name"
                :subtitle="year"
            />
            <MediaThumb
                    v-else
                    :loading="true"
            />
        </router-link>
    </div>
</template>

<script>
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
            showDetails: {
                loading: true,
                data: null,
            },
        };
    },
    computed: {
        poster() {
            if (this.showDetails.loading || !this.showDetails.data.poster_path) {
                return '';
            }

            return this.$root.tmdb.common.getImageUrl(this.showDetails.data.poster_path, 'w500');
        },
        year() {
            if (this.showDetails.loading) {
                return '';
            }

            return new Date(this.showDetails.data.first_air_date).getFullYear();
        },
    },
    methods: {
        loadData() {
            this.showDetails.loading = true;
            this.showDetails.data = null;

            this.$root.tmdb.tv.getSimpleDetails(this.id)
            .then(tv => {
                this.showDetails.data = tv;
                this.showDetails.loading = false;
            });
        },
    },
    mounted() {
        this.loadData();
    },
};
</script>
