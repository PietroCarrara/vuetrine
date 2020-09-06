<!--
    Component that receives a paged query for movies and displays cards of
    them.
-->

<template>
    <div>
        <HorizontalScroll class="py-3">
            <MovieThumb v-for="id of ids" :key="id" :movieID="id" class="mx-2" />
        </HorizontalScroll>
    </div>
</template>

<script>
import HorizontalScroll from "./HorizontalScroll.vue";
import MovieThumb from './MovieThumb.vue';

export default {
    name: 'MovieQuery',
    components: {
        HorizontalScroll,
        MovieThumb,
    },
    props: {
        query: {
            type: Promise,
            required: true,
        },
    },
    data() {
        return {
            ids: [],
            next: null, // Function to load the next page of movies
        };
    },
    methods: {
        loadNext() {
            if (this.next != null) {
                this.mountPromise(this.next());
            }
        },
        mountPromise(p) {
            p.then((q) => {
                console.log(q);
                this.ids.push(...q.response.results.map((m) => m.id));
                this.next = q.next;
            });
        },
    },
    mounted() {
        this.mountPromise(this.query);
    },
};
</script>