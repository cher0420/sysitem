
export const VOILD_TOKEN_URL = '/api/auth/validateToken'
export const VOILD_USERINFO = '/api/auth/GetUserInfo'

export const LOGIN = '?redirecturl='
export const LOGOUT = '?redirecturl='

export const BOT = '/api/Admin/BotManager/GetBotList' //获取机器人列表信息
export const DELETEBOT = '/api/Admin/BotManager/DeleteBot'//删除Bot
export const CREATEBOT = '/api/Admin/BotManager/CreateBot'//创建Bot

export const WECHATDETAil = '/api/Admin/WeChatSetting/Get' //微信配置信息显示
export const UPDATDETAIL = '/api/Admin/WeChatSetting/Update'//网页配置信息更新

export const BOTINFO = '/api/Admin/BotProfile/GetBotBaseInfo'//机器人信息获取
export const STOREINFO='/api/Admin/BotProfile/UpdateBotBaseInfo'//机器人信息获取

export const WEBINFO = '/api/Admin/WebChatSetting/Get'//网页配置信息显示
export const UPDATEWEB = '/api/Admin/WebChatSetting/Update'//网页配置信息更新
export const UPDATESTATUS = '/api/Admin/BotManager/GetBotStatus'//机器人信息获取

/*机器人知识问答*/
export const BOTKNOWQUIZSKILL = '/api/Admin/BotManager/SkillSetList'//获取技能列表
export const BOTKNOWQUIZLIST = '/api/Channel/V2/WebChat/GetSkillIntent'//获取意图列表
export const BOTKNOWDETAIL = '/api/Channel/V2/WebChat/GetKnowledge'//获取答案
export const UPDATEKNOWDETAIL = '/api/Channel/V2/WebChat/UpdateKnowledge'//更新、添加知识库
export const DELETEKMOWDETAIL = '/api/Channel/V2/WebChat/DeleteKnowledge'//删除答案

/*图片上传或删除*/
export const IMG_UPLOADORDELETE = '/api/Admin/File/UploadAndDeleteAsync'//图片上传与图片删除接口

/*快速问答列表*/
export const QUICKLYLIST = '/api/Admin/QQA/QueryKeyWordsList' //问题列表/关键字搜索
export const DELETEQUESTION = '/api/Admin/QQA/Delete'
export const QUERYSTATUS = '/api/Admin/QQA/QueryOperationStatus'  //获取数据状态接口
export const PUBLISHORTRAIN = '/api/Admin/QQA/PublishAiml'  //发布或测试接口

export const GETKEYWORDS = "/api/Admin/QQA/GetKeyWords"; // 分词
export const QUERYQADATA = "/api/Admin/QQA/QueryByKeyword"; //  根据关键字获取答案
export const STOREQADATA = "/api/Admin/QQA/Save"; // 存储答案

