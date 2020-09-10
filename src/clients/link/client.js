import { Client } from '../client';

export default class LinkClient extends Client {

    isValid() {
        return true; // You're always valid! :trans_rights:
    }

    getDownloads() {
        return new Promise(r => r([]));
    }

    downloadMagnet(magnet, info) {
        document.location.replace(magnet);
    }
}