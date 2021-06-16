<template>
    <div v-if="torrents === null" class="col-12 text-center font-weight-bold">
        Searching torrents...
        <LoadingSpinner class="mt-1" />
    </div>
    <div
        v-else-if="torrents.length <= 0"
        class="col-12 text-center p-2 font-weight-bold"
    >
        <div class="col-12">
            We couldn't find any torrents.
        </div>
        <div v-if="reloadinEnabled" class="col-12">
            <a role="button" class="btn btn-success badge px-2 py-1" v-on:click="reloadTorrents()">
                <i class="zmdi zmdi-refresh"></i>
            </a>
        </div>
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
                    <div class="text-truncate col" v-bind:title="torrent.title">
                        {{ torrent.title }}
                    </div>
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
        reloadinEnabled: {
            default: false,
        },
    },
    methods: {
        downloadTorrent(magnet) {
            this.$emit('download', magnet);
        },
        reloadTorrents() {
            this.$emit('reload');
        }
    },
}
</script>

<style scoped>
.striped:nth-child(even) {
    background-color: var(--scnd-bg-color);
}
.torrent-info {
    width: 6em;
}
</style>