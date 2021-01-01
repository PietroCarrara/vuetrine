<template>
    <div class="row">
        <div class="col-10">
            <input
                type="text"
                placeholder="Import custom magnet"
                class="form-control mr-2"
                v-model="customMagnet"
            />
        </div>
        <div class="col-2 pl-0">
            <button
                class="btn btn-outline-success"
                v-on:click="
                    click({
                        link: customMagnet,
                    })
                "
            >
                <i class="zmdi zmdi-download"></i>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CustomMagnet',
    props: {
        click: {
            required: true,
        },
    },
    data() {
        return {
            customMagnet: '',
        };
    }
}
</script>