import Transmission from './transmission';
import { Download, Client, DownloadInfo } from '../client';

const torrentFields = [
    'id',
    'downloadDir',
    'totalSize',
    'percentDone',
    'status',
];

class TransmissionClient extends Client {

    constructor() {
        super();

        var host = process.env['transmission-host'] || 'localhost';
        var port = process.env['transmission-port'] || '9091';
        var root = process.env['transmission-root'] || '/transmission/rpc';

        this.downloadDir = process.env['transmission-dowload-dir'] || '';
        if (this.downloadDir && !this.downloadDir.endsWith('/')) {
            this.downloadDir += '/';
        }

        this.transmission = new Transmission(host, Number(port), root);

        this.torrents = {};
    }

    async config() {
        // TODO: Check if host is OK

        this.fireUpdate();
    }

    fireUpdate() {
        this.updateTorrents()
            .then(new Promise(r => setTimeout(r, 2 * 1000))
                .then(() => this.fireUpdate()))
    }

    isValid() {
        // For now, we are always valid
        return true;
    }

    async pauseDownload(id) {
        return this.transmission.invoke('torrent-stop', {
            ids: [id],
        });
    }

    async resumeDownload(id) {
        return this.transmission.invoke('torrent-start', {
            ids: [id],
        });
    }

    async removeDownload(id) {
        return this.transmission.invoke('torrent-remove', {
            ids: [id],
            'delete-local-data': true,
        });
    }

    /**
     * Adds a torrent to the download queue
     * @param {String} magnet A magnet link
     * @param {DownloadInfo} info Metadata about the download
     */
    async downloadMagnet(magnet, info) {
        await this.checkDownloadDir();

        // We will save the metadata using the download path
        var downloadDir = this.downloadDir + info.type + '/';
        if (info.type == 'show') {
            var episode = info.isFullSeason ? 0 : info.episode;
            var full = info.isFullSeason ? 'full' : 'single';
            downloadDir += `${info.tmdb}.S${info.season}E${episode}.${full}/`;
        } else {
            downloadDir += info.tmdb + '/';
        }

        this.transmission.invoke('torrent-add', {
            filename: magnet,
            'download-dir': downloadDir,
        });
    }

    /**
     * @returns {{id: Download}} Downloads, keyed by their ID
     */
    async getDownloads() {
        var res = {};
        await this.checkDownloadDir();

        var torrents = await this.transmission.invoke('torrent-get', {
            fields: torrentFields,
        });

        for (var torrent of torrents.arguments.torrents) {
            var parts = torrent.downloadDir.split('/').filter(s => s.length > 0);
            var info = parts.pop();
            var type = parts.pop();

            var metadata;

            switch (type) {
                case 'movie':
                    metadata = new DownloadInfo(Number(info), type);
                    break;
                case 'show':
                    // TODO: Implement
                    break;
            }

            var trState = this.transmission.torrentState(torrent.status);

            var state;
            switch (trState) {
                case 'check-queue':
                case 'checking-files':
                case 'stopped':
                case 'waiting':
                    state = 'paused';
                    break;
                case 'downloading':
                    state = 'downloading';
                    break;
                case 'seed-queue':
                case 'seeding':
                    state = 'seeding';
                    break;
            }

            var download = new Download(metadata, state, torrent.percentDone, torrent.totalSize, torrent.id);
            res[download.id] = download;
        }

        return res;
    }

    /**
     * Checks if this.downloadDir is set, and if not,
     * sets it to the default transmission dir
     */
    async checkDownloadDir() {
        if (!this.downloadDir) {
            this.downloadDir = await this.getSessionStorage();
        }
    }

    // Return the default download location
    async getSessionStorage() {
        var res = await this.transmission.invoke('session-get', {
            fields: [
                'download-dir',
            ],
        });

        return res.arguments['download-dir'] + '/';
    }

    async updateTorrents() {
        // Only update if there are people looking!
        if (this.deleteCallbacks.length <= 0 && this.updateCallbacks.length <= 0) {
            return
        }

        var downloads = await this.getDownloads();

        for (var id in downloads) {
            // If this download has been updated
            if (!this.torrents[id] || !deepEquals(downloads[id], this.torrents[id])) {
                this.torrents[id] = downloads[id];
                this.updateDownload(downloads[id]);
            }
        }

        for (var id in this.torrents) {
            // If an old torrent is not among the new ones,
            // it has been deleted
            if (!Object.keys(downloads).includes(id)) {
                this.deleteDownload(this.torrents[id]);
                delete this.torrents[id];
            }
        }
    }
}

function deepEquals(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

export {
    TransmissionClient,
}