export const VOILD_TOKEN_URL = '/api/Tenant/ValidateToken'
export const VOILD_USERINFO = '/api/Tenant/GetUserInfo'

export const LOGIN = '/login/index?redirecturl='
export const LOGOUT = '/login/logout?redirecturl='

export const BOT = '/api/ChatBot/GetBotList'
export const DELETEBOT = '/api/ChatBot/DeleteBot'
export const CREATEBOT = '/api/ChatBot/GenerateBot'

export const WECHATDETAil = '/api/ChatBot/WeChatSetting'
export const UPDATDETAIL = '/api/ChatBot/UpdateWeChatSetting'

export const BOTINFO = '/api/BotProfile/QueryBotConfigInfo'

export const WEBINFO = '/api/ChatBot/WebPageSetting'
export const UPDATEWEB = '/api/ChatBot/UpdateWebPageSetting'
export const UPDATESTATUS = '/api/ChatBot/QueryBotStatus'

/*机器人知识问答*/
export const BOTKNOWQUIZSKILL = '/api/ChatBot/SkillSetList'
export const BOTKNOWQUIZLIST = '/api/V2/WebTalk/GetSkillIntent'
export const BOTKNOWDETAIL = '/api/V2/WebTalk/GetKnowledge'
export const UPDATEKNOWDETAIL = '/api/V2/WebTalk/UpdateKnowledge'

/*图片上传或删除*/
export const IMG_UPLOADORDELETE = '/api/KnowledgeQA/UploadAndDeleteAsync'
