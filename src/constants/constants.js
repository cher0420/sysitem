export const MENUS=[
  {
    id:'dashboard',
    chineseName:'仪表盘',
    path:'wait',
  },
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
          id:'channel',
          chineseName:'渠道配置',
          path:'channel',
          parent: 'bot',
          children:[
            {
              id:'web',
              chineseName:'网页',
              path:'web',
              parent: 'channel'
            },
            {
              id:'weChatService',
              chineseName:'微信服务号',
              path:'weChatService',
              parent: 'channel'
            },
            {
              id:'weChatCompany',
              chineseName:'微信企业号',
              path:'weChatCompany',
              parent: 'channel'
            },
            {
              id:'robot',
              chineseName:'实体机器人',
              path:'robot',
              parent: 'channel'
            },
            {
              id:'desktopApp',
              chineseName:'桌面应用',
              path:'desktopApp',
              parent: 'channel'
            },
          ]
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
                {
                  id:'edit',
                  chineseName:'编辑',
                  path:'edit',
                  parent: 'knowledgeQuiz',
                }
              ]
            },
            {
              id:'quicklyQA',
              chineseName:'快速问答',
              path:'quicklyQA',
              parent: 'knowledgeBuild',
              children:[
                {
                  id:'create',
                  chineseName:'新建',
                  path:'create',
                  parent: 'quicklyQA',
                },
                {
                  id:'edit',
                  chineseName:'编辑',
                  path:'edit',
                  parent: 'quicklyQA',
                }
              ]
            },
            {
              id:'keywordResponse',
              chineseName:'关键词回复',
              path:'keywordResponse',
              parent: 'knowledgeBuild',
              children:[
                {
                  id:'create',
                  chineseName:'新建',
                  path:'create',
                  parent: 'keywordResponse',
                },
                {
                  id:'edit',
                  chineseName:'编辑',
                  path:'edit',
                  parent: 'keywordResponse',
                }
              ]
            },
            {
              id:'guide',
              chineseName:'引导问题',
              path:'guide',
              parent: 'knowledgeBuild',

            }
          ]
        }
      ]
  },
  {
    id:'skill',
    chineseName:'机器人技能',
    path:'wait',
    children:
      [
        {
          id:'config',
          chineseName:'配置',
          path:'config'
        }
      ]
  },
  {
    id:'custom',
    chineseName:'定制服务',
    path:'wait',
    children:
      [
        {
          id:'config',
          chineseName:'配置',
          path:'config'
        }
      ]
  },
  {
    id:'opinion',
    chineseName:'意见反馈',
    path:'wait',
    children:
      [
        {
          id:'config',
          chineseName:'配置',
          path:'config'
        }
      ]
  },
  {
    id:'authority',
    chineseName:'权限管理',
    path:'wait',
    children:
      [
        {
          id:'config',
          chineseName:'配置',
          path:'config'
        }
      ]
  },
];

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
  createNewQA:'创建新问答',
  keywordResponse:'关键词回复',
  addKeyword:'添加关键词回复',
  editAnswer: '添加关键词回复',
  repeatAnswer:'添加关键词回复',
  updateAnswer:'编辑',
  guide:'引导问题'
}
export const USERNAME = 'userName';
export const TOKEN = 'token';
export const TENANTID = 'TenantId'
export const SID = 'SID'



