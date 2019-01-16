export const VOILD_TOKEN_URL = '/api/Tenant/ValidateToken'
export const VOILD_USERINFO = '/api/Tenant/GetUserInfo'

export const LOGIN = '?redirecturl='
export const LOGOUT = '?redirecturl='

export const BOT = '/api/ChatBot/GetBotList'
export const DELETEBOT = '/api/ChatBot/DeleteBot'
export const CREATEBOT = '/api/ChatBot/GenerateBot'

export const WECHATDETAil = '/api/ChatBot/WeChatSetting'
export const UPDATDETAIL = '/api/ChatBot/UpdateWeChatSetting'

export const BOTINFO = '/api/BotProfile/QueryBotConfigInfo'
export const STOREINFO='/api/BotProfile/StoreBotProfile'

export const WEBINFO = '/api/ChatBot/WebPageSetting'
export const UPDATEWEB = '/api/ChatBot/UpdateWebPageSetting'
export const UPDATESTATUS = '/api/ChatBot/QueryBotStatus'

/*机器人知识问答*/
export const BOTKNOWQUIZSKILL = '/api/ChatBot/SkillSetList'
export const BOTKNOWQUIZLIST = '/api/V2/WebTalk/GetSkillIntent'
export const BOTKNOWDETAIL = '/api/V2/WebTalk/GetKnowledge'
export const UPDATEKNOWDETAIL = '/api/V2/WebTalk/UpdateKnowledge'
export const DELETEKMOWDETAIL = '/api/V2/WebTalk/DeleteKnowledge'

/*图片上传或删除*/
export const IMG_UPLOADORDELETE = '/api/KnowledgeQA/UploadAndDeleteAsync'

/*快速问答列表*/
export const QUICKLYLIST = '/api/QuickQA/QueryKeyWordsList'
export const DELETEQUESTION = '/api/QuickQA/DeleteAnswer'
export const QUERYSTATUS = '/api/QuickQA/QueryDataStaus'  //获取数据状态接口
export const PUBLISHORTRAIN = '/api/QuickQA/PublishAiml'  //发布或测试接口

export const GETKEYWORDS = "/api/QuickQA/GetKeyWords"; // 分词
export const QUERYQADATA = "/api/QuickQA/QueryQAData"; //  根据关键字获取答案
export const STOREQADATA = "/api/QuickQA/StoreQAData"; // 存储答案

