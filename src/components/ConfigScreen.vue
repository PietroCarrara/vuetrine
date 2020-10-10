<template>
    <div class="row">
        <div class="col-12 text-center h2"><SiteLogo /> configuration</div>
        <div class="col-12 col-md-3 my-2">
            <div class="text-center font-weight-bold">TheMovieDB</div>
            <div class="card">
                <div class="card-body">
                    <form>
                        <div class="form-group">
                            <label for="tmdb-key">TMDB Key</label>
                            <input
                                id="tmdb-key"
                                v-model="tmdbKey"
                                type="text"
                                class="form-control"
                                placeholder="Enter your key"
                            />
                            <small class="form-text text-muted">
                                Don't have one? Get one
                                <a
                                    href="https://www.themoviedb.org/settings/api"
                                    target="_blank"
                                    >here</a
                                >.
                            </small>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="col-12 col-md-6 my-2">
            <div class="text-center font-weight-bold">Download Client</div>
            <div class="card">
                <div class="card-body">
                    <form>
                        <div class="form-group">
                            <label for="selected-client">
                                Client Selection
                            </label>
                            <select
                                id="selected-client"
                                v-model="selectedClient"
                                class="form-control"
                            >
                                <option disabled value="">
                                    Select a client
                                </option>
                                <option
                                    v-for="client in Object.keys(clients)"
                                    :key="client"
                                    :value="client"
                                >
                                    {{ client }} -
                                    {{ clients[client].description }}
                                </option>
                            </select>
                        </div>
                    </form>
                    <div class="p-2" v-if="clients[selectedClient]">
                        <small
                            v-if="
                                clients[selectedClient].configComponent === null
                            "
                            class="text-muted"
                        >
                            The {{ selectedClient }} client does not require
                            further configuration.
                        </small>
                        <component
                            v-else
                            :is="clients[selectedClient].configComponent"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-md-3 my-2">
            <div class="text-center font-weight-bold">Torrent Provider</div>
            <div class="card">
                <div class="card-body">
                    <form>
                        <div class="form-group">
                            <label for="selected-client">
                                Client Selection
                            </label>
                            <select
                                id="selected-client"
                                v-model="selectedProvider"
                                class="form-control"
                            >
                                <option disabled value="">
                                    Select a provider
                                </option>
                                <option
                                    v-for="provider in Object.keys(providers)"
                                    :key="provider"
                                    :value="provider"
                                >
                                    {{ provider }} -
                                    {{ providers[provider].description }}
                                </option>
                            </select>
                        </div>
                    </form>
                    <div class="p-2" v-if="providers[selectedProvider]">
                        <small
                            v-if="
                                providers[selectedProvider].configComponent ===
                                null
                            "
                            class="text-muted"
                        >
                            The {{ selectedProvider }} provider does not require
                            further configuration.
                        </small>
                        <component
                            v-else
                            :is="providers[selectedProvider].configComponent"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 text-center mt-4">
            <router-link
                :to="redirect"
                class="btn btn-primary"
                v-bind:class="{ disabled: !isValid }"
            >
                Done
            </router-link>
        </div>
        <div class="col-12 text-center mt-2">
            <a
                role="button"
                class="btn btn-danger"
                v-on:click="resetDefaults()"
            >
                Reset defaults
            </a>
        </div>
    </div>
</template>

<script>
import SiteLogo from './SiteLogo';
import { TheMovieDBCacheProxy } from '../tmdb/tmdbcache';
import { clients } from '../clients/clients';
import { providers } from '../providers/providers';

export default {
    name: 'ConfigScreen',
    components: {
        SiteLogo,
    },
    props: {
        redirect: {
            type: String,
            default: '/',
        },
    },
    data() {
        return {
            tmdbKey: this.$root.tmdb === null ? '' : this.$root.tmdb.key,
            selectedClient: this.currentClient(),
            selectedProvider: this.currentProvider(),
            clients,
            providers,
        };
    },
    computed: {
        isValid() {
            return this.$root.tmdb &&
                this.$root.tmdb.key.length > 0 &&
                this.$root.client &&
                this.$root.client.isValid() &&
                this.$root.provider &&
                this.$root.provider.isValid();
        },
    },
    methods: {
        currentClient() {
            if (this.$root.client === null) {
                return '';
            }

            for (var name in clients) {
                if (this.$root.client instanceof clients[name]) {
                    return name;
                }
            }

            return '';
        },
        currentProvider() {
            if (this.$root.provider === null) {
                return '';
            }

            for (var name in providers) {
                if (this.$root.provider instanceof providers[name]) {
                    return name;
                }
            }

            return '';
        },
        resetDefaults() {
            localStorage.clear();
            window.location.reload();
        }
    },
    watch: {
        tmdbKey() {
            if (this.$root.tmdb === null) {
                this.$root.tmdb = new TheMovieDBCacheProxy(this.tmdbKey);
            } else {
                this.$root.tmdb.key = this.tmdbKey;
            }
        },
        selectedClient() {
            if (this.$root.client) {
                this.$root.client.destroy();
            }

            this.$root.client = new clients[this.selectedClient]();
        },
        selectedProvider() {
            this.$root.provider = new providers[this.selectedProvider]();
        }
    },
    beforeDestroy() {
        this.$root.saveTMDB();
        this.$root.saveProvider();
        this.$root.saveClient();
    },
}
</script>
