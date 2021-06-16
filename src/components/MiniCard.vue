<template>
    <div class="rounded lifted mini-card bg-scnd">
        <slot />
    </div>
</template>

<script>
export default {
    name: 'MiniCard',
}
</script>

<style>
.mini-card {
    border: 0;
    width: 200px;
    min-height: 400px;
}
.mini-card-content {
    padding: 1.5rem;
}
.mini-card-cover-img {
    object-fit: cover;
    width: 100%;
    height: 100%;
}
</style>