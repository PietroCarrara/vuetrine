import YTS from './yts.js/yts';
import { Provider, MediaInfo, PagedResponse, TorrentMagnet } from '../provider';

export class YTSProvider extends Provider {
    constructor() {
        super();

        this.yts = new YTS();
    }

    loadConfig() {
        // We don't have any configuration to do right now
    }

    isValid() {
        return true; // You're always valid! :trans_rights:
    }

    /**
     * Searches for torrents for media 'info'
     * @param {MediaInfo} info Info to use when querying services
     * @param {Number=} page The page to look up using pagination. Should default to 1.
     * @returns {PagedResponse<[]String>} PagedResponce of array of magnet links, in no particular order
     */
    async getMagnets(info, page = 1) {
        var query = '';

        if (info.imdb) {
            query = info.imdb;
        } else if (info.title) {
            query = info.title;
        }

        if (info.type == 'show' || query == '') {
            // We don't have shows at yts
            return new PagedResponse([], null);
        }

        const itemsPerPage = 20;

        var data = await this.yts.searchMovies(query, page, itemsPerPage);
        data.movies = data.movies || [];

        var magnets = [];

        const trackers = [
            'udp://open.demonii.com:1337/announce',
            'udp://tracker.openbittorrent.com:80',
            'udp://tracker.coppersurfer.tk:6969',
            'udp://glotorrents.pw:6969/announce',
            'udp://tracker.opentrackr.org:1337/announce',
            'udp://torrent.gresille.org:80/announce',
            'udp://p4p.arenabg.com:1337',
            'udp://tracker.leechers-paradise.org:6969',
        ];

        for (var movie of data.movies) {
            const name = encodeURIComponent(movie.title_long);
            for (var torrent of movie.torrents) {
                var link = `magnet:?xt=urn:btih:${torrent.hash}&dn=${name}&tr=${trackers.join('&tr=')}`;
                var title = `${movie.title_long}.${torrent.quality}.${torrent.type}`;
                magnets.push(new TorrentMagnet(
                    title,
                    link,
                    torrent.size_bytes,
                ));
            }
        }

        return new PagedResponse(
            magnets,
            data.movies.length < itemsPerPage ? null : () => this.getMagnets(info, page + 1),
        );
    }
}