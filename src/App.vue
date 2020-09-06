<template>
    <div id="app">
        <HorizontalScroll class="py-2">
            <MovieThumb class="mx-2" :movieID="15" />
            <MovieThumb class="mx-2" :movieID="16" />
            <MovieThumb class="mx-2" :movieID="17" />
            <MovieThumb class="mx-2" :movieID="18" />
            <MovieThumb class="mx-2" :movieID="19" />
            <MovieThumb class="mx-2" :movieID="20" />
            <MovieThumb class="mx-2" :movieID="21" />
        </HorizontalScroll>
    </div>
</template>

<script>
import MovieThumb from "./components/MovieThumb.vue";
import HorizontalScroll from "./components/HorizontalScroll.vue";

export default {
    name: "App",
    components: {
        MovieThumb,
        HorizontalScroll,
    },
};
</script>
