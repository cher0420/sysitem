function host() {
  var TEST = {
    api:'https://hightalkadminapi-test.azurewebsites.net/api',
    fqavalidaimlApi:'https://hightalkfqavalidaiml-test.azurewebsites.net',
  }
  var UAT = {
    api:'https://htadminapi-uat.azurewebsites.net/api',
    fqavalidaimlApi:'https://hightalkfqavalidaiml-uat.azurewebsites.net',
  }
  var STAGING = {
    api:'https://hightalkadminapi-staging.azurewebsites.net/api',
    previewApi:'https://hightalkadminapi-staging.azurewebsites.net/api',
    quickQuizApi:'https://hightalkadminapi-staging.azurewebsites.net/api',
    fqavalidaimlApi:'https://hightalkfqavalidaiml-staging.azurewebsites.net',
    webTalkApi:'https://hightalkadminapi-staging.azurewebsites.net/api',
    webTalkV2Api:'https://hightalkadminapi-staging.azurewebsites.net/api'
  }
  return UAT
}
