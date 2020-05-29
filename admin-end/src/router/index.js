import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/',
            component: () =>
                import ( /* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [{
                    path: '/dashboard',
                    component: () =>
                        import (
                            /* webpackChunkName: "dashboard" */
                            '../components/page/Dashboard.vue'
                        ),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/table',
                    component: () =>
                        import (
                            /* webpackChunkName: "table" */
                            '../components/page/BaseTable.vue'
                        ),
                    meta: { title: '用户列表', permission: true }
                },
                {
                    path: '/tabs',
                    component: () =>
                        import (
                            /* webpackChunkName: "tabs" */
                            '../components/page/Tabs.vue'
                        ),
                    meta: { title: '系统通知' }
                },
                // 产品列表
                {
                    path: '/product',
                    component: () =>
                        import (
                            /* webpackChunkName: "tabs" */
                            '../components/page/Product.vue'
                        ),
                    meta: { title: '产品列表' }
                },
                // 新闻列表
                {
                    path: '/new',
                    component: () =>
                        import (
                            /* webpackChunkName: "tabs" */
                            '../components/page/New.vue'
                        ),
                    meta: { title: '新闻列表' }
                },
                // 案例列表
                {
                    path: '/case',
                    component: () =>
                        import (
                            /* webpackChunkName: "tabs" */
                            '../components/page/Case.vue'
                        ),
                    meta: { title: '案例列表' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () =>
                        import (
                            /* webpackChunkName: "upload" */
                            '../components/page/Upload.vue'
                        ),
                    meta: { title: '文件上传' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () =>
                        import (
                            /* webpackChunkName: "permission" */
                            '../components/page/Permission.vue'
                        ),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/message',
                    component: () =>
                        import ('../components/page/Message.vue'),
                    meta: { title: '通知管理', permission: true }
                },
                {
                    path: '/404',
                    component: () =>
                        import ( /* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () =>
                        import ( /* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: () =>
                import ( /* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});