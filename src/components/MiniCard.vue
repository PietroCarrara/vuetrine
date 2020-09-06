<template>
    <div class="rounded lifted mini-card">
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
    height: 400px;
}
.mini-card-content {
    padding: 1.5rem;
}
</style>