<template>
    <div>
        <LoadingSpinner v-if="loading" />
        <div v-else>
            <div v-if="Object.keys(downloads).length <= 0" class="text-center text-muted">
                No downloads at the moment.
            </div>
            <HorizontalScroll v-else>
                <div v-for="download of downloads" :key="download.id">
                    <MovieDownload
                        v-if="download.info.type == 'movie'"
                        v-on:toggle-status="toggleStatus"
                        v-on:remove-download="removeDownload"
                        class="mx-2 my-3"
                        :download="download"
                    />
                </div>
            </HorizontalScroll>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import HorizontalScroll from './HorizontalScroll.vue';
import LoadingSpinner from './LoadingSpinner.vue';
import MovieDownload from './MovieDownload.vue';


export default {
    name: 'DownloadsList',
    components: {
        LoadingSpinner,
        HorizontalScroll,
        MovieDownload,
    },
    data() {
        return {
            loading: true,
            downloads: {},
        };
    },
    methods: {
        updateDownload(download) {
            Vue.set(this.downloads, download.id, download);
        },
        deleteDownload(download) {
            Vue.delete(this.downloads, download.id);
        },
        toggleStatus(download) {
            if (download.status === 'paused') {
                this.$root.client.resumeDownload(download.id);
            } else {
                this.$root.client.pauseDownload(download.id);
            }
        },
        removeDownload(download) {
            this.$root.client.removeDownload(download.id);
        }
    },
    mounted() {
        this.$root.client.getDownloads().then(d => {
            this.loading = false;
            this.downloads = d;
        });

        this.$root.client.registerUpdateCallback(this.updateDownload);
        this.$root.client.registerDeleteCallback(this.deleteDownload);
    },
    beforeDestroy() {
        this.$root.client.removeUpdateCallback(this.updateDownload);
        this.$root.client.removeDeleteCallback(this.deleteDownload);
    }
}
</script>