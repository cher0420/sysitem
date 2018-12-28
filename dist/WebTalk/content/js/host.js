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
    fqavalidaimlApi:'https://hightalkfqavalidaiml-staging.azurewebsites.net',
  }
  return UAT
}
