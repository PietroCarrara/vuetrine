<template>
    <div v-if="torrents === null" class="col-12 font-weight-bold">
        Searching torrents...
        <LoadingSpinner class="mt-1" />
    </div>
    <div v-else-if="torrents.length <= 0" class="col-12 font-weight-bold">
        We couldn't find any torrents.
    </div>
    <div class="col-12 row" v-else>
        <div class="col-12">
            <hr />
            <h4>Download Options:</h4>

            <div class="col-12 pr-0">
                <div
                    v-for="torrent of torrents"
                    :key="torrent.link"
                    class="row col-12 py-3 striped"
                >
                    <div>
                        <a
                            role="button"
                            class="btn btn-success badge mr-1"
                            v-on:click="downloadTorrent(torrent)"
                        >
                            <i class="zmdi zmdi-download"></i>
                        </a>
                        <span class="badge py-1 badge-secondary torrent-info">{{
                            torrent.size | size
                        }}</span>
                    </div>
                    <div class="text-truncate col">{{ torrent.title }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import LoadingSpinner from './LoadingSpinner.vue';

export default {
    name: 'TorrentList',
    components: {
        LoadingSpinner,
    },
    props: {
        torrents: Array,
    },
    methods: {
        downloadTorrent(magnet) {
            this.$emit('download', magnet);
        },
    },
}
</script>

<style scoped>
.striped:nth-child(even) {
    background-color: #f8f9fa;
}
.torrent-info {
    width: 6em;
}
</style>