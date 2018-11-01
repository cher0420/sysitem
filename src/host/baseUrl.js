const TEST_URL = {
  baseUrl:'https://hightalkmarketadminportal-test.azurewebsites.net',
  SSOWebUrl:{
    zh:"https://hightalkssoweb-test.azurewebsites.net/zh-cn",
    en:'/'
  },
  SSOServerApi:"https://hightalkssoapi-test.azurewebsites.net",
  requestHost: 'https://hightalkadminapi-test.azurewebsites.net'
}
const STAGING_URL = {
  SSOWebUrl:{
    zh:"https://login-staging.hightalk.ai/zh-cn",
    en:'/'
  },
  SSOServerApi:"https://hightalkssoapi-staging.azurewebsites.net",
  baseUrl:'https://hightalkadminportal-staging.azurewebsites.net',
  requestHost: 'https://hightalkadminapi-staging.azurewebsites.net'
}
export default STAGING_URL
