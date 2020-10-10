import Vue from 'vue'
import VueRouter from 'vue-router'
import PopularMedia from '../components/PopularMedia.vue'
import MovieInfo from '../components/MovieInfo.vue'
import ShowInfo from '../components/ShowInfo.vue'
import SeasonInfo from '../components/SeasonInfo.vue'
import SearchMedia from '../components/SearchMedia.vue'
import DownloadsList from '../components/DownloadsList.vue';
import ConfigScreen from '../components/ConfigScreen.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'home',
        component: PopularMedia,
    },
    {
        path: '/movie/:id',
        name: 'movie-info',
        component: MovieInfo,
        props: route => ({id: Number(route.params.id)}),
    },
    {
        path: '/show/:id',
        name: 'show-info',
        component: ShowInfo,
        props: route => ({id: Number(route.params.id)}),
    },
    {
        path: '/show/:showid/season/:seasonnumber',
        name: 'season-info',
        component: SeasonInfo,
        props: route => ({showID: Number(route.params.showid), seasonNumber: Number(route.params.seasonnumber)}),
    },
    {
        path: '/search',
        name: 'search-media',
        component: SearchMedia,
        props: route => ({q: route.query.q}),
    },
    {
        path: '/downloads',
        name: 'downloads',
        component: DownloadsList,
    },
    {
        path: '/config',
        name: 'config',
        component: ConfigScreen,
        props: route => ({redirect: route.query.redirect}),
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router
