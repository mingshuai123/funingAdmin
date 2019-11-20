import Vue from 'vue';
import Router from 'vue-router';
import { getToken } from './utils/user'

Vue.use(Router);

const routes2 = [{
        path: '*',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: () =>
            import ('./view/login'),
        meta: {
            title: '登录'
        }
    },
    {
        path: '/menus',
        name: 'menus',
        component: () => import ('./view/menu'),
        meta: {title: '菜单'}
    },
    {
        path: '/recharge',
        name: 'recharge',
        component: () => import ('./view/actions/recharge'),
        meta: {title: '玩家充卡'}
    },
    {
        path: '/player',
        name: 'player',
        component: () => import ('./view/actions/player'),
        meta: {title: '玩家信息'}
    },
    // 朋友圈
    {
        path: '/friends',
        name: 'friends',
        component: () => import ('./view/friendsClub/friends'),
        meta: {title: '朋友圈'}
    },
    {
        path: '/clubManage',
        name: 'clubManage',
        component: () => import ('./view/friendsClub/clubManage'),
        meta: {title: '朋友圈管理'}
    },
    {
        path: '/playerManage',
        name: 'playerManage',
        component: () => import ('./view/friendsClub/playerManage'),
        meta: {title: '朋友圈成员'}
    },
    {
        path: '/matchManage',
        name: 'matchManage',
        component: () => import ('./view/friendsClub/matchManage'),
        meta: {title: '朋友圈比赛'}
    },
    // 积分圈
    {
        path: '/integral',
        name: 'integral',
        component: () => import ('./view/integralClub/integral'),
        meta: {title: '积分圈'}
    },
    {
        path: '/integralManage',
        name: 'integralManage',
        component: () => import ('./view/integralClub/clubManage'),
        meta: {title: '积分圈'}
    },
    {
        path: '/settingManage',
        name: 'settingManage',
        component: () => import ('./view/integralClub/settingManage'),
        meta: {title: '积分圈'}
    },
    {
        path: '/integralMatch',
        name: 'integralMatch',
        component: () => import ('./view/integralClub/matchManage'),
        meta: {title: '积分圈'}
    },
    {
        path: '/playerManage2',
        name: 'playerManage2',
        component: () => import ('./view/integralClub/playerManage2'),
        meta: {title: '朋友圈成员'}
    },
    {
        path: '/purchase',
        name: 'purchase',
        component: () => import ('./view/actions/purchase'),
        meta: {title: '购买房卡'}
    },
    {
        path: '/purchaserec',
        name: 'purchaserec',
        component: () => import ('./view/actions/purchaserec'),
        meta: {title: '购买房卡'}
    },
    {
        path: '/reissue',
        name: 'reissue',
        component: () => import ('./view/actions/reissue'),
        meta: {title: '补卡记录'}
    },
    // 代理管理
    {
        path: '/buyManage',
        name: 'buyManage',
        component: () => import ('./view/admin/buyManage'),
        meta: {title: '购卡管理'}
    },
    {
        path: '/agentManage',
        name: 'agentManage',
        component: () => import ('./view/admin/agentManage'),
        meta: {title: '代理管理'}
    },
    {
        path: '/agentDetail',
        name: 'agentDetail',
        component: () => import ('./view/admin/agentDetail'),
        meta: {title: '代理详情'}
    },
    {
        path: '/noticeManage',
        name: 'noticeManage',
        component: () => import ('./view/admin/noticeManage'),
        meta: {title: '公告管理'}
    },
    {
        path: '/applyManage',
        name: 'applyManage',
        component: () => import ('./view/admin/applyManage'),
        meta: {title: '代理申请'}
    },
    {
        path: '/clubDetail',
        name: 'clubDetail',
        component: () => import ('./view/admin/clubDetail'),
        meta: {title: '朋友圈详情'}
    },
    {
        path: '/integalDetail',
        name: 'integalDetail',
        component: () => import ('./view/admin/integalDetail'),
        meta: {title: '积分圈详情'}
    },
    // 统计
    {
        path: '/statistics',
        name: 'statistics',
        component: () => import ('./view/actions/statistics'),
        meta: {title: '积分圈详情'}
    },
    {
        path: '/gameRound',
        name: 'gameRound',
        component: () => import ('./view/actions/game_round'),
        meta: {title: '战绩'}
    },
    {
        path: '/standings',
        name: 'standings',
        component: () => import ('./view/actions/standings'),
        meta: {title: '战绩'}
    },
    {
        path: '/creatClub',
        name: 'creatClub',
        component: () => import ('./view/actions/creatClub'),
        meta: {title: '创建圈'}
    },
];

// add route path
routes2.forEach(route => {
    route.path = route.path || '/' + (route.name || '');
});

const router = new Router({
    mode: 'hash',
    routes: routes2
});
const whiteList = ['/login', '/register'];
router.beforeEach((to, from, next) => {
    const title = to.meta && to.meta.title;
    if (title) {
        document.title = title;
    }
    
    const token = getToken();
    // if (document.URL.indexOf('index.html?t=') < 0) {
        // alert(window.location.href)
        // let timestamp = (new Date()).valueOf()
        // window.location.href = '/stone/index.html?t=' + timestamp + '#' + to.fullPath
    // }
    if (token) {
        if (to.path === '/login') {
            next({ path: '/menus' })
        } else {
            next();
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            // router.push({path:'/login'})
            next(`/login?redirect=${to.fullPath}`);
            // next({path:'/login',query:'redit='+to.fullpath});
        }
    }
});

export {
    router
};