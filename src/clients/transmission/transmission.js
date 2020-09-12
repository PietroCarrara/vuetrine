/**
 * https://github.com/transmission/transmission/blob/master/extras/rpc-spec.txt
 */
export default class Transmission {

    constructor(host = 'localhost', port = 9091, root = '/transmission/rpc') {
        if (!host.startsWith('http')) {
            host = 'http://' + host;
        }
        if (!root.startsWith('/')) {
            root = '/' + root;
        }

        this.host = host;
        this.port = port;
        this.root = root;

        // CSRF token
        this.token = '';
    }

    /**
     * Make a request to the web transmission daemon
     */
    fetch(data) {
        return window.fetch(`${this.host}:${this.port}${this.root}`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'X-Transmission-Session-Id': this.token,
            },
            body: JSON.stringify(data),
        }).then(async r => {
            if (r.ok) {
                return await r.json();
            } else {
                if (r.status == 409) {
                    this.token = r.headers.get('X-Transmission-Session-Id');

                    return await this.fetch(data);
                }
            }
        });
    }

    /**
     * Invokes an action through RPC
     * @param {String} method The method to invoke trough RPC
     * @param {{String: String}} args Map of arguments
     */
    invoke(method, args) {
        return this.fetch({
            method,
            arguments: args,
        });
    }

    /**
     * Returns a string representing a torrent state
     * @param {Number} state The transmission state
     * @returns {'stopped'|'check-queue'|'checking-files'|'waiting'|'downloading'|'seed-queue'|'seeding'}
     */
    torrentState(state) {
        switch (state) {
            case 0:
                return 'stopped';  /* Torrent is stopped */
            case 1:
                return 'check-queue';  /* Queued to check files */
            case 2:
                return 'checking-files';  /* Checking files */
            case 3:
                return 'waiting';  /* Queued to download */
            case 4:
                return 'downloading';  /* Downloading */
            case 5:
                return 'seed-queue';  /* Queued to seed */
            case 6:
                return 'seeding'; /* Seeding */
        }
    }
}