class TorrentMagnet {
    /**
     * @param {String} title The name of the magnet
     * @param {String} link The actual link of the magnet
     * @param {Number} size Torrent size in bytes
     */
    constructor(title, link, size = 0) {
        this.title = title;
        this.link = link;
        this.size = size;
    }
}

/**
 * Information on some type of media, such as type (tv show, movie...),
 * name, episode, season...
 * ALL of the fields may be null, so one must check before using anything
 */
class MediaInfo {
    /**
     * @param {Object} info Information about the media
     * @param {String=} info.title The media title
     * @param {'show'|'movie'=} info.type Whether the media represents
     * @param {Number=} info.season The media season number. Ignore if type === 'movie'
     * @param {Number=} info.episode The media episode number. Ignore if type === 'movie'
     * @param {String=} info.imdb The media imdb id
     * @param {Boolean=} info.isEntireSeason Whether this instance represents a entire season or not. Ignore if type ==='movie'
     */
    constructor(info) {
        this.title = info.title;
        this.type = info.type;
        this.season = info.season;
        this.episode = info.episode;
        this.imdb = info.imdb;
        this.isEntireSeason = info.isEntireSeason;
    }
}

class PagedResponse {
    /**
     * @param {Object} response The response
     * @param {Function<Promise<PagedResponse>>} next Callback that returns the next page. Null if there is no next page.
     */
    constructor(response, next) {
        this.response = response;
        this.next = next;
    }
}

/**
 * Abstract class for torrent providers
 * Exists mostly for documentation purposes
 */
class Provider {

    static get description() {
        return '';
    }

    static get configComponent() {
        return null;
    }

    /**
     * A mandatory parameterless constructor
     * This should put the provider in a 'default' state
     */
    constructor() {

    }

    /**
     * Save any relevant configuration data to the localStorage
     */
    save() {

    }

    /**
     * Load data from localStorage
     */
    load() {

    }

    /**
     * Should return whether the provider is currently in a valid state
     * (i.e it has all the data it needs and the data is valid)
     * @returns {Boolean}
     */
    isValid() {

    }

    /**
     * Searches for torrents for media 'info'
     * @param {MediaInfo} info Info to use when querying services
     * @param {Number=} page The page to look up using pagination. Should default to 1.
     * @returns {PagedResponse<[]String>} PagedResponce of array of magnet links, in no particular order
     */
    async getMagnets(info, page) {

    }
}

export {
    Provider,
    MediaInfo,
    PagedResponse,
    TorrentMagnet,
}