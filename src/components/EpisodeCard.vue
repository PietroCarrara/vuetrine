<template>
    <div class="bg-scnd row lifted rounded">
        <div class="col-4 no-gutters p-0">
            <img
                v-if="poster"
                :src="poster"
                class="img-fluid rounded-left poster"
                v-bind:class="{ 'img-selected': selected }"
            />
        </div>
        <div class="col-7 px-2 py-2">
            <p
                class="text-truncate h5"
                v-bind:class="{ 'text-muted': new Date() < dateObj }"
            >
                {{ episode.episode_number }}. {{ episode.name }}
            </p>
            <p class="text-muted">{{ date }}</p>
        </div>
        <div class="col-1 p-0">
            <a
                v-on:click="click()"
                class="btn btn-block d-table"
                v-bind:class="{ 'btn-selected': selected }"
                role="button"
            >
                <div>
                    <i v-if="selected" class="zmdi zmdi-chevron-down"></i>
                    <i v-else class="zmdi zmdi-chevron-right"></i>
                </div>
            </a>
        </div>
        <div v-if="selected" class="col-12 p-0">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: 'EpisodeCard',
    props: {
        selected: {
            type: Boolean,
            default: false,
        },
        episode: {
            type: Object,
            required: true,
        },
    },
    computed: {
        poster() {
            if (!this.episode.still_path) {
                return '';
            }

            return this.$root.tmdb.common.getImageUrl(this.episode.still_path, 'w500');
        },
        date() {
            if (!this.dateObj) {
                return '';
            }

            return this.dateObj.toLocaleDateString();
        },
        dateObj() {
            if (!this.episode.air_date) {
                return null;
            }

            return new Date(this.episode.air_date);
        }
    },
    methods: {
        click() {
            this.$emit('clicked', this.selected);
        }
    }
}
</script>

<style scoped>
.poster {
    object-fit: cover;
    height: 100%;
    width: 100%;
}

.btn {
    border-radius: 0rem 0.25rem 0.25rem 0rem;
    padding-top: 100%;
    padding-bottom: 100%;
    height: 100%;

    color: #fff;
    background-color: #686b73;
    border-color: #686b73;
}

.btn-selected {
    background-color: var(--main-bg-color);
    border-color: var(--main-bg-color);
    border-radius: 0rem 0.25rem 0rem 0rem;
}

.img-selected {
    border-radius: 0.25rem 0rem 0rem 0rem !important;
}
</style>