// 引入路由组件
// import Home from '@/pages/Home';
// import Search from '@/pages/Search';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Detail from '@/pages/Detail';
import AddCartSuccess from '@/pages/AddCartSuccess';
import ShopCart from '@/pages/ShopCart';
import Trade from '@/pages/Trade';
import Pay from '@/pages/Pay';
import PaySuccess from '@/pages/PaySuccess';
import Center from '@/pages/Center';
// 引入二级路由组件
import myOrder from '@/pages/Center/myOrder';
import groupOrder from '@/pages/Center/groupOrder';

// 路由懒加载
// 当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就会更加高效。

// 路由配置信息
export default [
    {
        path: '/home',
        component: ()=>{     //第一个是完整写法，下面都是简写形式
            // console.log('home');
            return import('@/pages/Home');
        },
        // 路由元信息
        meta: {
            show: true
        }
    },
    {
        path: '/trade',
        component: Trade,
        meta: {
            show: true
        },
        // 路由独享守卫-beforeEnter-进入该路由前都要经过它
        beforeEnter: (to, from, next) => {
            // 必须从购物车shopcart前往交易trade页面
            if(from.path=='/shopcart'){
                next();
            }else{
                // 注意：next(false)中断当前导航，会回到from来时的路由地址（即停留在当前页）
                next(false);
            }
        }
    },
    {
        path: '/pay',
        component: Pay,
        meta: {
            show: true
        },
        beforeEnter: (to, from, next) => {
            // 只有从交易页面（创建订单）才能跳转到支付页面
            if(from.path=='/trade'){
                next();
            }else{
                next(false);
            }
        }
    },
    {
        path: '/paysuccess',
        component: PaySuccess,
        meta: {
            show: true
        }
    },
    {
        path: '/center',
        component: Center,
        meta: {
            show: true
        },
        // 通过children配置子级路由
        children:[
            {
                path:'myorder',      // '/center/myorder'
                component:myOrder,
            },
            {
                path:'grouporder',     // '/center/grouporder'
                component:groupOrder,
            },
            // 路由重定向
            // 只要访问/center，就会跳转到/center/myorder
            {
                path: '/center',
                redirect:'/center/myorder'
            }
        ]
    },
    {
        path: '/shopcart',
        component: ShopCart,
        meta: {
            show: true
        }
    },
    {
        path: '/addcartsuccess',
        component: AddCartSuccess,
        name:'addcartsuccess',
        meta: {
            show: true
        }
    },
    {
        // params参数需要使用占位符声明接收
        path: '/detail/:skuId',
        component: Detail,
        meta: {
            show: true
        }
    },
    {
        // params参数需要使用占位符声明接收
        path: '/search/:keyword?',
        component: ()=>import('@/pages/Search'),
        meta: {
            show: true
        },
        name: 'search',
        // 路由是可以给组件传递props的
        props: (route) => ({
            keyword: route.params.keyword,
            big: route.query.big
        }),

        // 面试题4：路由组件能不能传递props数据?
        // 答：可以，且有三种写法。在路由器路由中配置。注意都需要在目标组件中接收参数。props:['a','b'],
        // 第一种写法：props值为布尔值，布尔值为true，则把路由收到的所有params参数通过props传给组件。所以只适合params写法。
        // props:true,
        // 第二种写法：props值为对象，该对象中所有的key-value的组合最终都会通过props传给组件
        // props:{a:900,b:'你好'},     //很少使用
        // 第三种写法（常用）：props值为函数，该函数返回的对象中每一组key-value都会通过props传给组件，params写法和query写法都可使用
        // props(route){
        // 	return {
        // 		id:route.params.id,    // 使用query参数时就是route.query.id
        // 		title:route.params.title
        // 	}
        // }
    },
    {
        path: '/login',
        component: Login,
        meta: {
            show: false
        }
    },
    {
        path: '/register',
        component: Register,
        meta: {
            show: false
        }
    },
    // 重定向：当项目跑起来的时候，访问其他无效路由时，都会跳转到首页
    {
        path: '*',
        redirect: '/home',
        meta: {
            show: true
        }
    }
]