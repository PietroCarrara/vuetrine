<template>
    <div class="horizontal-scroll">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "HorizontalScroll",
};
</script>

<style>
.horizontal-scroll {
    display: flex;
    flex-wrap: nowrap;
    overflow: auto;
}
.horizontal-scroll > div {
    flex: 0 0 auto;
}
</style>