const TEST_URL = {
  baseUrl:'https://portal-test.hightalk.ai',
  SSOWebUrl:{
    zh:"https://hightalkssoweb-test.azurewebsites.net/zh-cn",
    en:'/'
  },
  SSOServerApi:"https://hightalkssoapi-test.azurewebsites.net",
  requestHost: 'https://hightalkadminapi-test.azurewebsites.net',
}
const UAT_URL = {
  baseUrl:'https://hightalkadminweb-uat.azurewebsites.net',
  SSOWebUrl:{
    zh:"https://hightalkssoweb-test.azurewebsites.net/zh-cn",
    en:'/'
  },
  SSOServerApi:"https://hightalkssoapi-test.azurewebsites.net",
  requestHost: 'https://hightalkadminapi-uat.azurewebsites.net',
}
const STAGING_URL = {
  baseUrl:'https://portal-staging.hightalk.ai',
  SSOWebUrl:{
    zh:"https://login-staging.hightalk.ai/zh-cn",
    en:'/'
  },
  SSOServerApi:"https://hightalkssoapi-staging.azurewebsites.net",
  requestHost: 'https://hightalkadminapi-staging.azurewebsites.net'
}
export default TEST_URL
