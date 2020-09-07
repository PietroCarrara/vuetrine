import Vue from 'vue'
import VueRouter from 'vue-router'
import PopularMedia from '../components/PopularMedia.vue'
import MovieInfo from '../components/MovieInfo.vue'
import ShowInfo from '../components/ShowInfo.vue'
import SeasonInfo from '../components/SeasonInfo.vue'
import SearchMedia from '../components/SearchMedia.vue'

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
    },
    {
        path: '/show/:showid/season/:seasonnumber',
        component: SeasonInfo,
        props: route => ({showID: Number(route.params.showid), seasonNumber: Number(route.params.seasonnumber)}),
    },
    {
        path: '/search',
        component: SearchMedia,
        props: route => ({q: route.query.q}),
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
