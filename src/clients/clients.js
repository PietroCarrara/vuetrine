const { LinkClient } = require('./link/client');
const { TransmissionClient } = require('./transmission/client');

const clients = {
    'link': LinkClient,
    'transmission': TransmissionClient,
};

export {
    clients,
};