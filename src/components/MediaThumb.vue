<template>
    <MiniCard>
        <LoadingSpinner v-if="loading" style="padding-top: 150px"></LoadingSpinner>
        <div v-else>
            <div style="height: 300px">
                <img v-if="poster" :src="poster"
                    class="mini-card-cover-img rounded-top"
                />
                <h4 v-else class="text-center pt-4">No Poster.</h4>
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
        title: {},
        subtitle: {},
        poster: {
            type: String,
        },
    }
}
</script>