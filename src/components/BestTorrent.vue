<template>
    <div class="col-12 col-lg-6 mt-3 text-center">
        <div v-if="torrents === null" class="font-weight-bold">
            Searching torrents...
            <LoadingSpinner class="mt-1" />
        </div>
        <div v-else-if="torrents.length <= 0" class="font-weight-bold">
            <div class="col-12">We couldn't find any torrents.</div>
            <div v-if="reloadinEnabled" class="col-12">
                <a
                    role="button"
                    class="btn btn-success badge px-2 py-1"
                    v-on:click="reloadTorrents()"
                >
                    <i class="zmdi zmdi-refresh"></i>
                </a>
            </div>
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
        reloadinEnabled: {
            default: true,
        },
    },
    computed: {
        bestMagnet() {
            if (!this.torrents || this.torrents.length <= 0) {
                return null;
            }

            return this.$root.bestMagnet(this.torrents);
        },
        reloadTorrents() {
            this.$emit('reload');
        }
    },
    methods: {
        downloadTorrent(magnet) {
            this.$emit('download', magnet);
        },
    },
}
</script>