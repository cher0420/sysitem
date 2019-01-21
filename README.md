# admin-portal

> all copy for pactera

## Build Setup

``` bash
# install dependencies
npm install


# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
### 项目路由文件：router/index.js
>- 二级菜单（配置或设置页面）请配置
>/bot/config... 即一级菜单/config/...
>- 二级菜单内列表数据详情页，请配置
>/bot/config/.../... 并赋予name名为'detail'，新建页面name为'create'，编辑name为'edit'
>```
>{
>         path:'config/knowledgeQuiz/knowledgeDetail',
>         component: resolve =>
>           require(["../page/bot/config/knowledgeDetail/index"], resolve),
>        name: 'detail',
>       },
>```

用户信息存储在store.state.app.userInfo

element组件地址：
http://element-cn.eleme.io/#/zh-CN/component/layout

