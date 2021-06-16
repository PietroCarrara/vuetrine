<template>
    <div id="app">
        <nav class="lifted main-nav navbar navbar-expand-lg navbar-dark">
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
                        class="input-scnd form-control mr-sm-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                    />
                    <button class="btn btn-outline-success my-2 my-sm-0" type="button">
                        Search
                    </button>
                </form>
            </div>
        </nav>
        <div class="py-4 px-3">
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
                if (!this.$root.isValid()) {
                    this.$router.push({ path: '/config', query: { 'redirect': this.$router.currentRoute.path } });
                }
            }
        },
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
    box-shadow: 0 4px 8px 0 black;
    /* box-shadow: 0 8px 16px 0 black; */
}

:root {
    --main-bg-color: #42414d;
    --scnd-bg-color: #1c1b22;

    --main-text-color: white;
    --mute-text-color: rgb(175, 175, 175);
}

select, input, input:focus {
    background: var(--scnd-bg-color) !important;
    color: var(--main-text-color) !important;
}
input::placeholder {
    color: var(--mute-text-color) !important;
}

body {
    background-color: var(--main-bg-color);
    color: var(--main-text-color);
}

a, a:hover {
    color: var(--main-text-color);
}

.main-nav {
    box-shadow: 0 0px 8px 0 black;
    background-color: var(--scnd-bg-color);
}

.select-scnd, .input-scnd, .input-scnd:focus {
    background-color: var(--main-bg-color) !important;
}

.bg-scnd {
    background-color: var(--scnd-bg-color);
}

.text-muted {
    color: var(--mute-text-color) !important;
}
</style>