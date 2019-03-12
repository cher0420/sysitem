
export const VOILD_TOKEN_URL = '/api/auth/validateToken'
export const VOILD_USERINFO = '/api/auth/getUserInfo'

export const LOGIN = '?redirecturl='
export const LOGOUT = '?redirecturl='

export const BOT = '/api/admin/portal/botmanager/getbotlist' //获取机器人列表信息
export const DELETEBOT = '/api/admin/portal/botmanager/deletebot'//删除Bot
export const CREATEBOT = '/api/admin/portal/botmanager/createbot'//创建Bot

export const WECHATDETAil = '/api/admin/portal/wechatsetting/get' //微信配置信息显示
export const UPDATDETAIL = '/api/admin/portal/wechatsetting/update'//微信配置信息更新

export const BOTINFO = '/api/admin/bot/botprofile/getbotbaseinfo'//机器人信息获取
export const STOREINFO='/api/admin/bot/botprofile/updatebotbaseinfo'//更新机器人信息

export const WEBINFO = '/api/admin/portal/webchatsetting/get'//网页配置信息显示
export const UPDATEWEB = '/api/admin/portal/webchatsetting/update'//网页配置信息更新
export const UPDATESTATUS = '/api/admin/portal/botmanager/getbotstatus'//机器人状态值获取

/*机器人知识问答*/
export const BOTKNOWQUIZSKILL = '/api/admin/portal/botmanager/skillsetlist'//获取技能列表
export const BOTKNOWQUIZLIST = '/api/admin/channel/v2/webchat/getskillintent'//获取意图列表
export const BOTKNOWDETAIL = '/api/admin/channel/v2/webchat/getknowledge'//获取答案
export const UPDATEKNOWDETAIL = '/api/admin/channel/v2/webchat/updateknowledge'//更新、添加知识库
export const DELETEKMOWDETAIL = '/api/admin/channel/v2/webchat/deleteknowledge'//删除答案

/*图片上传或删除*/
export const IMG_UPLOADORDELETE = '/api/admin/portal/file/uploadanddeleteasync'//图片上传与图片删除接口

/*快速问答列表*/
export const QUICKLYLIST = '/api/admin/portal/qqa/querykeywordslist' //问题列表/关键字搜索
export const DELETEQUESTION = '/api/admin/portal/qqa/delete'//删除快速问答关键字
export const QUERYSTATUS = '/api/admin/portal/qqa/queryoperationstatus'  //快速问答获取数据状态接口
export const PUBLISHORTRAIN = '/api/admin/portal/qqa/publishaiml'  //快速问答发布或测试接口

export const GETKEYWORDS = "/api/admin/portal/qqa/getkeywords"; // 快速问答分词接口
export const QUERYQADATA = "/api/admin/portal/qqa/querybykeyword"; //  快速问答根据关键字获取答案
export const STOREQADATA = "/api/admin/portal/qqa/save"; // 快速问答存储答案

// 关键词回复
export const KEYWORDLIST = '/api/admin/keyword/KQA/search';//关键词列表
export const KEYWORDLEADEXCEL = '/api/admin/keyword/KQA/Upload';//导入关键词
export const KEYWORDDOWNLOAD = '';//下载关键词模版
export const DELETEKEYWORD = '/api/admin/keyword/KQA/clear/';//删除关键词
export const KEYWORDCLEAR = '/api/admin/keyword/KQA/clear' //清空数据
export const KEYWORDENABLE= '/api/admin/portal/KQA/UpdateEnable';//停用或开启功能
export const KEYWORDSTATUS = '/api/admin/portal/KQA/Get'; //获取功能开启状态
export const ADDKEYWORD = '/api/admin/keyword/KQA/add';// 添加关键词
export const VERIFYDUPLICATED = '/api/admin/keyword/KQA/verifyDuplicated';//重复校验
export const UPDATEANSWER = '/api/admin/keyword/KQA/update';//更新答案
export const SEARCHKERWORD = '/api/admin/keyword/KQA/search';//查询关键字(加载数据)
