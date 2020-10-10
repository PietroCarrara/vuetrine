import { Client } from '../client';

export class LinkClient extends Client {

    static get description() {
        return 'Opens magnet links with the browser (recommended)';
    }

    isValid() {
        return true; // You're always valid! :trans_rights:
    }

    async getDownloads() {
        return [];
    }

    downloadMagnet(magnet, info) {
        document.location.replace(magnet);
    }
}