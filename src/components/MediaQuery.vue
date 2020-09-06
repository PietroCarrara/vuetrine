<!--
    Component that receives a paged query for movies and displays cards of
    them.
-->

<template>
    <div>
        <HorizontalScroll class="py-3">
            <component v-bind:is="component" v-for="id of ids" :key="id" :id="id" class="mx-2" />

            <MiniCard v-if="next != null" class="mx-2 text-center">
                <a v-on:click="loadNext()" class="btn btn-primary" style="margin-top: 150px;" role="button">
                    Load More
                </a>
            </MiniCard>

            <MiniCard v-if="loading" class="mx-2">
                <LoadingSpinner />
            </MiniCard>
        </HorizontalScroll>
    </div>
</template>

<script>
import HorizontalScroll from "./HorizontalScroll.vue";
import LoadingSpinner from './LoadingSpinner.vue';
import MiniCard from './MiniCard.vue';
import MovieThumb from './MovieThumb.vue';
import ShowThumb from './ShowThumb.vue';


export default {
    name: 'MediaQuery',
    components: {
        HorizontalScroll,
        MovieThumb,
        MiniCard,
        LoadingSpinner,
    },
    props: {
        query: {
            type: Promise,
            required: true,
        },
        component: {
            require: true,
            validator(value) {
                return value == ShowThumb || value == MovieThumb;
            }
        }
    },
    data() {
        return {
            ids: [],
            loading: true,
            next: null, // Function to load the next page of movies
        };
    },
    methods: {
        loadNext() {
            if (this.next != null) {
                this.loading = true;
                this.mountPromise(this.next());
            }
        },
        mountPromise(p) {
            this.next = null;
            p.then((q) => {
                this.loading = false;
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