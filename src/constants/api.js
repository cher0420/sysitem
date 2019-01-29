
export const VOILD_TOKEN_URL = '/api/auth/validateToken'
export const VOILD_USERINFO = '/api/auth/getUserInfo'

export const LOGIN = '?redirecturl='
export const LOGOUT = '?redirecturl='

export const BOT = '/api/admin/botmanager/getbotList' //获取机器人列表信息
export const DELETEBOT = '/api/admin/botmanager/deletebot'//删除Bot
export const CREATEBOT = '/api/admin/botmanager/createBot'//创建Bot

export const WECHATDETAil = '/api/admin/wechatsetting/get' //微信配置信息显示
export const UPDATDETAIL = '/api/admin/wechatsetting/update'//网页配置信息更新

export const BOTINFO = '/api/admin/botprofile/getbotbaseinfo'//机器人信息获取
export const STOREINFO='/api/admin/botprofile/updatebotbaseinfo'//机器人信息获取

export const WEBINFO = '/api/admin/webchatsetting/get'//网页配置信息显示
export const UPDATEWEB = '/api/admin/webchatsetting/update'//网页配置信息更新
export const UPDATESTATUS = '/api/admin/botmanager/getbotstatus'//机器人信息获取

/*机器人知识问答*/
export const BOTKNOWQUIZSKILL = '/api/admin/botmanager/skillsetlist'//获取技能列表
export const BOTKNOWQUIZLIST = '/api/channel/v2/webchat/getskillintent'//获取意图列表
export const BOTKNOWDETAIL = '/api/channel/v2/webchat/getknowledge'//获取答案
export const UPDATEKNOWDETAIL = '/api/channel/v2/webchat/updateknowledge'//更新、添加知识库
export const DELETEKMOWDETAIL = '/api/channel/v2/webchat/deleteknowledge'//删除答案

/*图片上传或删除*/
export const IMG_UPLOADORDELETE = '/api/admin/file/uploadanddeleteasync'//图片上传与图片删除接口

/*快速问答列表*/
export const QUICKLYLIST = '/api/admin/qqa/querykeywordslist' //问题列表/关键字搜索
export const DELETEQUESTION = '/api/admin/qqa/delete'
export const QUERYSTATUS = '/api/admin/qqa/queryoperationstatus'  //获取数据状态接口
export const PUBLISHORTRAIN = '/api/admin/qqa/publishaiml'  //发布或测试接口

export const GETKEYWORDS = "/api/admin/qqa/getkeywords"; // 分词
export const QUERYQADATA = "/api/admin/qqa/querybykeyword"; //  根据关键字获取答案
export const STOREQADATA = "/api/admin/qqa/save"; // 存储答案

