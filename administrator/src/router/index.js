import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [{
        path: '/',
        redirect: '/user/login',
    },
    {
        path: '/user',
        component: () =>
            import ('../views/user/User.vue'),
        children: [{
            path: '/user/login',
            component: () =>
                import ('../views/user/Loginin.vue'),
        }, ],
    },
    {
        path: '/detail',
        component: () =>
            import ('../views/detail/Admin.vue'),
        children: [{
                path: '/detail/cases',
                component: () =>
                    import ('../views/detail/Cases.vue'),
            },
            {
                path: '/detail/news',
                component: () =>
                    import ('../views/detail/News.vue'),
            },
            {
                path: '/detail/products',
                component: () =>
                    import ('../views/detail/Products.vue'),
            },
        ],
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;