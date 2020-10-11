import { MediaInfo, PagedResponse, Provider, TorrentMagnet } from '../provider';

class CORSClient {
    constructor() {
        this.host = 'https://thingproxy.freeboard.io/fetch/';
    }

    fetch(q = {}) {
        var url = new URL(this.host + 'https://torrentapi.org/pubapi_v2.php');

        if (q) {
            for (var i in q) {
                url.searchParams.append(i, q[i]);
            }
        }

        return fetch(url);
    }
}

class RarbgProvider extends Provider {

    static get description() {
        return 'rarbg.to torrents';
    }

    constructor(appID = 'vuetrine') {
        super();

        this.appID = appID;

        this.client = new CORSClient();

        this.token = '';
        this.tokenTime = null;

        this.requestQeue = []; // Request queue
        this.isWorking = false; // Request queue lock

        this.renewToken();
    }

    async renewToken() {
        this.tokenTime = new Date();

        var t = await this.request({
            'get_token': 'get_token',
        });
        var obj = await t.json();

        this.token = obj.token;
    }

    async fetch(q = {}) {
        if (this.tokenTime === null ||
            this.token === '' ||
            (new Date().getTime() - this.tokenTime.getTime())/1000 > 15 * 60) { // If we're past 15 mins
            await this.renewToken();
        }

        q = Object.assign(q, {
            token: this.token,
        });

        return this.request(q);
    }

    request(q = {}) {
        q = Object.assign(q, {
            app_id: this.appID,
        });

        var r = new Promise(r => {
            this.requestQeue.push({
                request: [q],
                cb: r,
            });
        });

        this.work();

        return r;
    }

    // Keep dequeuing the requests
    async work() {
        if (this.isWorking) {
            return
        }

        this.isWorking = true;

        while (this.requestQeue.length > 0) {
            var item = this.requestQeue.shift();

            var r = this.client.fetch(...item.request);

            // Wait at least 2s
            await Promise.all([
                new Promise(r => setTimeout(r, 2 * 1000)),
                r
            ]);

            item.cb(r);
        }

        this.isWorking = false;
    }



    isValid() {
        return true;
    }

    /**
     * @param {MediaInfo} info Info to use when querying services
     * @param {Number=} page The page to look up using pagination. Should default to 1.
     * @returns {PagedResponse<[]TorrentMagnet>} PagedResponce of array of magnet links, in no particular order
     */
    async getMagnets(info, page) {
        var params = {
            limit: 100,
            mode: 'search',
            format: 'json_extended',
        };

        if (info.imdb) {
            params.search_imdb = info.imdb;
        } else if (info.title) {
            params.search_string = info.title;
        } else {
            // We don't have enough info
            return new PagedResponse([], null);
        }

        // TODO: Special treatment for TV shows

        var torrents = await (await this.fetch(params)).json();

        if (torrents.error) {
            return new PagedResponse([], null);
        }

        var res = [];
        for (var torrent of torrents.torrent_results) {
            res.push(new TorrentMagnet(
                torrent.title,
                torrent.download,
                torrent.size,
            ));
        }

        return new PagedResponse(res, null);
    }

    destroy() {
        this.requestQeue = [];
    }
}

export {
    RarbgProvider,
}