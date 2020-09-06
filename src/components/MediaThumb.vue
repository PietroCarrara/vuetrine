<template>
    <MiniCard>
        <LoadingSpinner v-if="loading"></LoadingSpinner>
        <div v-else>
            <div style="height: 300px">
                <img :src="poster"
                    class="media-thumb-img rounded-top"
                />
            </div>
            <div class="p-3 text-center">
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
    width: 100%;
    height: 100%;
}
</style>