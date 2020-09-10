import LinkClient from './link/client'

const clients = {
    'link': LinkClient,
}

class Download {
    /**
     * @param {DownloadInfo} info Metadata about this download
      * @param {Number} completion Download completion in range [0, 1]
      * @param {Number} size Download size in bytes
      * @param {*} id A unique identifier, used to refer to this download on actions
      */
    constructor(info, completion, size, id) {
        this.info = info;
    }
}

class DownloadInfo {

    /**
     * @param {Number} tmdb The tmdb id of the media
     * @param {'show'|'movie'} type The type of the media
     * @param {Number} season The season number
     * @param {Boolean} isFullSeason Whether this is a download of the entire season, rather than a single episode
     * @param {Number} episode The episode number
     */
    constructor(tmdb, type, season = 0, isFullSeason = false, episode = 0) {
        this.tmdb = tmdb;
        this.type = type;
        this.season = season;
        this.isFullSeason = isFullSeason;
        this.episode = 0;
    }
}

class Client {
    /**
     * Mandatory parameterless constructor
     */
    constructor() {
        this.updateCallbacks = [];
    }

    /**
     * @returns {Boolean} Whether this instance has all the data it needs in order to function
     */
    isValid() {

    }

    /**
     * @returns {[DownloadInfo]}
     */
    async getDownloads() {

    }

    /**
     * Adds a torrent to the download quere
     * @param {String} magnet A magnet link
     * @param {DownloadInfo} info Metadata about the download
     */
    downloadMagnet(magnet, info) {

    }

    /**
     * Should be called by child classes when data is updated on a torrent,
     * INCLUDING when a new torrent is added
     * @param {Download} download The torrent that has been updated
     */
    updateDownload(download) {
        for (var cb of this.updateCallbacks) {
            cb(download);
        }
    }

    registerUpdateCallback(cb) {
        this.updateCallbacks.push(cb);
    }

    clearUpdateCallbacks() {
        this.updateCallbacks = [];
    }
}

export {
    Client,
    Download,
    DownloadInfo,
    clients,
}