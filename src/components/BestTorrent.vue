<template>
    <div class="col-12 col-lg-6 mt-3 text-center">
        <div v-if="torrents === null" class="font-weight-bold">
            Searching torrents...
            <LoadingSpinner class="mt-1" />
        </div>
        <div v-else-if="torrents.length <= 0" class="font-weight-bold">
            We couldn't find any torrents.
        </div>
        <a
            v-else-if="bestMagnet != null"
            v-on:click="downloadTorrent(bestMagnet)"
            class="btn btn-block btn-success font-weight-bold"
        >
            {{ bestMagnet.size | size }}
            <i class="zmdi zmdi-download"></i>
        </a>
    </div>
</template>

<script>
import LoadingSpinner from './LoadingSpinner.vue';

export default {
    name: 'BestTorrent',
    components: {
        LoadingSpinner,
    },
    props: {
        torrents: Array,
    },
    computed: {
        bestMagnet() {
            if (!this.torrents || this.torrents.length <= 0) {
                return null;
            }

            return this.$root.bestMagnet(this.torrents);
        }
    },
    methods: {
        downloadTorrent(magnet) {
            this.$emit('download', magnet);
        },
    },
}
</script>