<template>
    <div>
        <h3 class="py-2 text-center">Movies for "{{name | capitalize}}"</h3>
        <MediaQuery :query="searchMovies(name, year)" :component="MovieThumb" />
        <h3 class="py-2 text-center">Shows for "{{name | capitalize}}"</h3>
        <MediaQuery :query="searchShows(name, year)" :component="ShowThumb" />
    </div>
</template>

<script>
import MediaQuery from "./MediaQuery.vue";
import MovieThumb from './MovieThumb.vue';
import ShowThumb from './ShowThumb.vue';

export default {
    name: 'PopularMedia',
    components: {
        MediaQuery,
    },
    props: {
        q: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            MovieThumb,
            ShowThumb,
            yearRegex: /\((\d{4})\)$/, // Capture 4 digits inside parenthesis
        };
    },
    computed: {
        name() {
            var n = this.q.trim();

            return n.replace(this.yearRegex, '').trim();
        },
        year() {
            var matches = this.yearRegex.exec(this.q.trim());

            if (matches && matches.length > 1) {
                return Number(matches[1]);
            }
        },
    },
    methods: {
        searchMovies(q, y) {
            var opts = {};

            if (y) {
                opts.year = y;
            }

            return this.$root.tmdb.search.movie(q, 1, opts);
        },
        searchShows(q, y) {
            var opts = {};

            if (y) {
                opts.firstAirDateYear = y;
            }

            return this.$root.searchShows(q, 1, opts);
        },
    },
    filters: {
        capitalize(v) {
            if (!v) return '';

            return v.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
        }
    }
};
</script>