<template>
    <div class="rounded mini-card">
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
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.75);
    border: 0;
    width: 200px;
    height: 400px;
}
.mini-card-content {
    padding: 1.5rem;
}
</style>