import Transmission from './transmission';
import { Download, Client, DownloadInfo } from '../client';

class TransmissionClient extends Client {

    // to enable cors: gogo-cors-proxy -target localhost:9091 -listen localhost:9092 -origin http://localhost:8080
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
    }

    isValid() {
        // For now, we are always valid
        return true;
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

    async getDownloads() {
        var res = [];
        await this.checkDownloadDir();

        var torrents = await this.transmission.invoke('torrent-get', {
            fields: [
                'id',
                'downloadDir',
                'totalSize',
                'percentDone',
                'status',
            ],
        });

        for (var torrent of torrents.arguments.torrents) {
            console.log(torrent);
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

            res.push(new Download(
                metadata,
                state,
                torrent.percentDone,
                torrent.totalSize,
                torrent.id
            ));
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
}

export {
    TransmissionClient,
}