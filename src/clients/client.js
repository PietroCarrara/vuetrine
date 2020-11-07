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
     * @param {Object} info
     * @param {string} info.title The title of the media
     * @param {Number} info.year The year of release of the media
     * @param {Number} info.tmdb The tmdb id of the media
     * @param {'show'|'movie'} info.type The type of the media
     * @param {Number} info.season The season number
     * @param {Boolean} info.isFullSeason Whether this is a download of the entire season, rather than a single episode
     * @param {Number} info.episode The episode number
     */
    constructor(info) {
        this.title = info.title;
        this.year = info.year;
        this.tmdb = info.tmdb;
        this.type = info.type;
        this.season = info.season;
        this.isFullSeason = info.isFullSeason;
        this.episode = info.episode;
    }
}

class Client {

    /**
     * A description to present to the user.
     */
    static get description() { return '' }

    /**
     * A component to use when configuring this
     * client on the configuration screen.
     */
    static get configComponent() { return null };

    /**
     * Mandatory parameterless constructor
     */
    constructor() {
        this.updateCallbacks = [];
        this.deleteCallbacks = [];
    }

    /**
     * Save configuration to local storage
     */
    save() {

    }

    /**
     * Load configuration from local storage
     */
    load() {

    }

    /**
     * Shut down this client. Send requests to close a session
     * and etc.
     */
    destroy() {

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