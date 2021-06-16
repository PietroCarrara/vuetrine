<template>
    <div>
        <form>
            <div class="form-group">
                <label for="tmdb-key">Transmission Host</label>
                <input
                    id="transmission-host"
                    v-model="transmissionHost"
                    type="text"
                    class="form-control input-scnd"
                    placeholder="Enter the address to the transmission daemon"
                />
            </div>
            <div class="form-group">
                <label for="tmdb-key">RPC Port</label>
                <input
                    id="transmission-host"
                    v-model.number="transmissionPort"
                    type="number"
                    class="form-control input-scnd"
                    placeholder="Enter the port number the daemon is listening on"
                />
            </div>
            <div class="form-group">
                <label for="tmdb-key">RPC Root</label>
                <input
                    id="transmission-host"
                    v-model="transmissionRoot"
                    type="text"
                    class="form-control input-scnd"
                    placeholder="Enter the root path for the RPC"
                />
            </div>
        </form>
    </div>
</template>

<script>
import Transmission from './transmission';
export default {
    name: 'TransmissionConfig',
    data() {
        return {
            transmissionHost: this.$root.client.transmission.host,
            transmissionPort: this.$root.client.transmission.port,
            transmissionRoot: this.$root.client.transmission.root,
        };
    },
    watch: {
        transmissionHost() {
            this.$root.client.transmission = new Transmission(
                this.transmissionHost,
                this.$root.client.transmission.port,
                this.$root.client.transmission.root
            );
        },
        transmissionPort() {
            this.$root.client.transmission = new Transmission(
                this.$root.client.transmission.host,
                this.transmissionPort,
                this.$root.client.transmission.root
            );
        },
        transmissionRoot() {
            this.$root.client.transmission = new Transmission(
                this.$root.client.transmission.host,
                this.$root.client.transmission.port,
                this.transmissionRoot
            );
        },
    }
}
</script>