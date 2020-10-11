<template>
    <div id="app">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <router-link to="/" class="navbar-brand">
                <SiteLogo />
            </router-link>
            <button
                class="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#main-navbar"
                aria-controls="main-navbar"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="main-navbar">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <router-link to="/downloads" class="nav-link">
                            Downloads
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link :to="{ path: '/config', query: { 'redirect': this.$router.currentRoute.path } }" class="nav-link">
                            Configuration
                        </router-link>
                    </li>
                </ul>
                <form
                    class="form-inline my-2 my-lg-0"
                    v-on:submit.prevent="search(searchName)"
                >
                    <input
                        v-model="searchName"
                        class="form-control mr-sm-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                    />
                    <button class="btn btn-outline-success my-2 my-sm-0" type>
                        Search
                    </button>
                </form>
            </div>
        </nav>
        <div class="container py-4">
            <router-view />
        </div>
    </div>
</template>

<script>
import SiteLogo from './components/SiteLogo';

export default {
    name: 'App',
    components: {
        SiteLogo,
    },
    data() {
        return {
            searchName: '',
        };
    },
    methods: {
        search(name) {
            if (name) {
                this.$router.push({ path: '/search', query: { q: name } });
            }
        },
        checkValidity() {
            if (this.$router.currentRoute.name !== 'config') {
                if (!this.isValid()) {
                    this.$router.push({ path: '/config', query: { 'redirect': this.$router.currentRoute.path } });
                }
            }
        },
        isValid() {
            return this.$root.tmdb &&
                this.$root.tmdb.key.length > 0 &&
                this.$root.client &&
                this.$root.client.isValid() &&
                this.$root.provider &&
                this.$root.provider.isValid();
        }
    },
    beforeMount() {
        this.checkValidity();
    },
    beforeUpdate() {
        this.checkValidity();
    },
}
</script>

<style>
.lifted {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.75);
}
</style>