# admin-portal
推荐采用Xmind格式查看
##请按照以下顺序熟悉项目
- 安装node、npm，地址：https://nodejs.org/zh-cn/
- 命令行 node -v，出现 ```v10.13.0```版本号即为安装成功
- 配置taobao镜像，地址：http://npm.taobao.org/   （不配置也可以）
- 使用 npm install 安装包
>## start 启动项目
npm run dev
>##build  打包项目
npm run build
>##项目ip地址
https://192.168.1.103:10033
>##docker环境更新
checkin至master代码即可
>###增加页面
- 需先配置路由，注意大小写，地址：src/router/index.js
- 配置菜单
  1.确定页面为第几级菜单，仿照下列嵌套规则。
  2.当前级别下的子菜单，使用children参数添加数组
  3.子菜单请添加parent字段，值为父级id

```
 {
    id:'bot',
    chineseName:'机器人列表',
    path:'bot',
    children:
      [
        {
          id:'config',
          chineseName:'基本资料',
          path:'config',
          parent: 'bot'
        },
        {
          id:'knowledgeBuild',
          chineseName:'知识建设',
          path:'knowledgeBuild',
          parent: 'bot',
          children:[
            {
              id:'knowledgeQuiz',
              chineseName:'知识问答',
              path:'knowledgeQuiz',
              parent: 'knowledgeBuild',
              children:[
                {
                  id:'create',
                  chineseName:'新建',
                  path:'create',
                  parent: 'knowledgeQuiz',
                },
              ]
            },
          ]
        }
      ]
  },
```
- 编写页面，src/page/...
- 一个路由对应一个文件夹
- 页面布局文件 src/layout

>###更改已有需求
- 找到需求地址，例如：```http://localhost:3000/#/bot```
- 在 src/router/index.js 内寻找#后的路由
- 再寻找对应页面
>###权限验证
src/permissions
>###常量
- src/constants/constants.js
- 常量一律采用大写格式
```
import {REMEMBER,LOCALKEY,TOKEN} from "../../constants/constants";
```
>### 项目入口文件
src/main.js
```
//登录
//vue render 函数在 getLoginStatus 内部执行，
getLoginStatus()
```
>### 项目路由文件
router/index.js
- 一级菜单
```
      {
        path:'/',
        name:'custom',
        component: resolve =>
          require(["../page/wait/index"], resolve),
      }
```
- 二级菜单（配置或设置页面）请配置
/bot/config... 即一级菜单/config/...
- 二级菜单内列表数据详情页，请配置
/bot/config/.../... 并赋予name名为'detail'
```
{
       path:'config/knowledgeQuiz/knowledgeDetail',
         component: resolve =>
           require(["../page/bot/config/knowledgeDetail/index"], resolve),
        name: 'detail',
},
```
- 二级菜单内列表数据新建页，请配置
/bot/config/.../... 并赋予name名为'create'
```
      {
        path:'config/quicklyQA/createrNewQA',  // 创建新问答
        component: resolve =>
          require(["../page/bot/config/quicklyQA/createrNewQA/index"], resolve),
        name: 'create',
      },
```
- 二级菜单内列表数据编辑页，请配置
/bot/config/.../... 并赋予name名为'edit'
```
    {
        path:'config/quicklyQA/updateQA',  // 创建新问答/更新问答
        component: resolve =>
          require(["../page/bot/config/quicklyQA/createrNewQA/updateQA"], resolve),
        name: 'edit',
      },
```
- 标题部分需要配置中文名
src/constants/constants.js
```
export const STR = {
  authority:'权限管理',
  custom:'定制服务',
  opinion:'意见反馈',
  bot:'机器人列表',
  skill:'机器人技能',
  dashboard:'仪表盘',
  create: '创建',
  edit: '编辑',
  config:'基本资料',
  web:'网页',
  weChatService:'微信服务号',
  weChatCompany:'微信企业号',
  robot:'实体机器人',
  desktopApp:'桌面应用',
  knowledgeQuiz:'知识问答',
  knowledgeDetail:'知识问答',
  caseStore:'案例库',
  quicklyQA:'快速问答',
  createrNewQA:'创建新问答',
  updateQA:'创建新问答',
  editQA:'编辑',
  keywordResponse:'关键词回复'
}
```
>###样式
src/style
- 公共样式 :src/style/index.scss
- 公共样式里有默认色、默认背景、各种字体大小等
- 修改ui框架样式：src/style/form.scss （不同组件请单独命名）
- 私有样式请单独开发在相应page需求内
>###请求方法
src/serive/request.js
- 项目使用fetch方法请求
- 已兼容到ie9
- 默认get方法
- 通过then获取正确响应
- 通过catch捕获错误信息
- 接口 status:0 为失败，1为成功
```
        (resolve, reject) =>{
          const headers = {...params.headers,"Content-Type": "application/json; charset=utf-8"}
          const body = params.body
          const method = params.method||"GET"
          fetch(api, {
            headers,
            body,
            method
          }).then(
            (response) =>{
              switch (response.status) {
                case 200:
                  return response.json()
                case 401:
                  redirect(LOGIN)
                  break;
                default:
                alert('服务器异常，请稍后重试')
              }
            }
          ).then(
            (res)=>{
              if (res.Status) {
                 resolve(res)
              } else {
                 reject(res)
              }
            }
          ).catch(
            (err)=>{
               reject(err)
            }
          )
        }
```
>###公用组件
src/components
>###面包屑及标题更改
没有特殊标题时，只需在router里配置正确即可，
特殊字符，请使用store.dispatch(REPlACE,{title: 'XXXXX'})
>###公用工具js
src/utils
>###api处理
api地址请统一放置在 src/constants/api.js内
>###静态文件，例如图片位置
static
>###公用状态处理store
src/store
- 现有公用状态数据
```
    app: {
      reloadId:0,                                      //bot页面轮询id
      name:'智能服务机器人',                              //config默认机器人名
      config: false,                                   //是否显示二级菜单
      activeKey: 'bot',                                //一级菜单默认选中项
      defaultActiveSecondM:'config',                   //二级菜单active-key
      userName: '',                                    //用户名
      userInfo: {},                                    //用户信息
      isCollapse: false,                               //折叠菜单状态
      aSideWidth: '14vw',                              //菜单宽度
      breadArr:[{url:'/',name :'首页'}],                //面包屑数组


      PageIndex: 1,                                     //分页页数
      PageSize: 10,                                     //当前页的条数
      total: 0,                                         //列表总数
      searchStatus:null,                                //搜索状态
      tableData:[],                                     //列表数据
      loading: false,                                   //加载状态
      description: '',
      Key:'',
      SkillNo:'',
      quickQuizRecordId:null,
      id:null,
      // doingStatus: false,
      quickQuizArr:[],                                   //快速问答数组

      mainLoading:false,                                 //整页加载
      loadingText:null,                                  //全局加载时显示提示语
    },
```
>###静态页面WebTalk
- WebTalk文件夹目前与adminPortal共享服务器资源
- 相关负责人：庞立敏
- 禁止迁移文件目录位置
>###项目使用的框架及ui链接
- https://cn.vuejs.org/
- https://router.vuejs.org/
- https://vuex.vuejs.org/
- http://element-cn.eleme.io/#/zh-CN
>###其他注意事项
- 此项目使用ES6及以上语言开发
- 函数名为小驼峰命名法，类名为中线横杠命名，常量命名为全部大写命名
- 需兼容至IE9
- 本地代理
config/index.js
```      proxyTable: {
               '/api/auth': {// HT.Api.Auth API接口
                 target: 'https://192.168.1.103:10001',// 接口的域名
                 secure: false,// 如果是https接口，需要配置这个参数
                 changeOrigin: true,// 如果接口跨域，需要进行这个参数配置
              },
        }
 ```
- 本地重定向
build/webpack.dev.conf.js
```
    before(app){
      app.get('/web/auth/login', function(req, res) {
        const value = req.query
        const redirecturl = value.redirecturl
        const type = value.type
        res.redirect(302, 'https://192.168.1.103:10003?redirecturl='+redirecturl+'&type='+type);
      });
    }
```
- 此项目采用单点登录形式进行权限验证
#####项目涉及负责人：孙磊（后端接口）
swagger地址：https://192.168.1.103:100017/swagger/index.html
