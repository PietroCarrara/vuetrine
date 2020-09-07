import Vue from 'vue'
import VueRouter from 'vue-router'
import PopularMedia from '../components/PopularMedia.vue'
import MovieInfo from '../components/MovieInfo.vue'
import ShowInfo from '../components/ShowInfo.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: PopularMedia
    },
    {
        path: '/movie/:id',
        component: MovieInfo,
        props: route => ({id: Number(route.params.id)}),
    },
    {
        path: '/show/:id',
        component: ShowInfo,
        props: route => ({id: Number(route.params.id)}),
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
