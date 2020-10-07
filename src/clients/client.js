class Download {
    /**
     * @param {DownloadInfo} info Metadata about this download
     * @param {'paused'|'downloading'|'completed'} status Current download status
     * @param {Number} completion Download completion in range [0, 1]
     * @param {Number} size Download size in bytes
     * @param {'paused'|'downloading'|'completed'} status
     * @param {*} id A unique identifier, used to refer to this download on actions
     */
    constructor(info, status, completion, size, id) {
        this.info = info;

        this.status = status;
        this.completion = completion;
        this.size = size;
        this.id = id;
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
     * Don't make any heavy lifting (requests, configuration loading...) here.
     */
    constructor() {
        this.updateCallbacks = [];
        this.deleteCallbacks = [];
    }

    /**
     * Do your configuration at this step.
     * You can make requests and load stuff
     */
    async config() {

    }

    /**
     * @returns {Boolean} Whether this instance has all the data it needs in order to function
     */
    isValid() {

    }

    /**
     * @returns {{id: Download}} Downloads, keyed by their ID
     */
    async getDownloads() {

    }

    /**
     * Adds a torrent to the download queue
     * @param {String} magnet A magnet link
     * @param {DownloadInfo} info Metadata about the download
     */
    downloadMagnet(magnet, info) {

    }

    /**
     * Pauses a download
     * @param {*} id Download id
     */
    async pauseDownload(id) {

    }

    /**
     * Resumes a download
     * @param {*} id Download id
     */
    async resumeDownload(id) {

    }

    /**
     * Removes and deletes download data
     * @param {*} id Download id
     */
    async removeDownload(id) {

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

    /**
     * Should be called by child classes when a torrent is removed
     * @param {Download} download The torrent that has been deleted
     */
    deleteDownload(download) {
        for (var cb of this.deleteCallbacks) {
            cb(download);
        }
    }

    registerUpdateCallback(cb) {
        this.updateCallbacks.push(cb);
    }

    removeUpdateCallback(cb) {
        this.updateCallbacks = this.updateCallbacks.filter(x => x !== cb);
    }

    clearUpdateCallbacks() {
        this.updateCallbacks = [];
    }

    registerDeleteCallback(cb) {
        this.deleteCallbacks.push(cb);
    }

    removeDeleteCallback(cb) {
        this.deleteCallbacks = this.deleteCallbacks.filter(x => x !== cb);
    }

    clearDeleteCallbacks() {
        this.deleteCallbacks = [];
    }
}

export {
    Client,
    Download,
    DownloadInfo,
}