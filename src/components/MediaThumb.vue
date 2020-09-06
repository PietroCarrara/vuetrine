<template>
    <MiniCard>
        <LoadingSpinner v-if="loading"></LoadingSpinner>
        <div v-else>
            <img :src="poster"
                class="media-thumb-img rounded-top"
            />
            <div class="p-3">
                <h5 class="text-truncate">{{ title }}</h5>
                <h6 class="text-muted">{{ subtitle }}</h6>
            </div>
        </div>
    </MiniCard>
</template>

<script>
import LoadingSpinner from './LoadingSpinner.vue'
import MiniCard from './MiniCard.vue'


export default {
    name: 'MediaThumb',
    components: {
        LoadingSpinner,
        MiniCard,
    },
    props: {
        loading: {
            type: Boolean,
            default: false,
        },
        title: {
            required: true,
        },
        subtitle: {
            require: true,
        },
        poster: {
            type: String,
            required: true,
        },
    }
}
</script>

<style>
.media-thumb-img {
    object-fit: cover;
    max-width: 100%;
    max-height: 100%;
}
</style>