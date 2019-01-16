$(document).ready(function () {

  $.fn.sso = function () {
    var token = $.cookie('token');
    if(token == "" || token == null || token == undefined){

    }else{
      validateToken(token);
    }

    function validateToken(token){
      var validateTokenRequest = {
        Token: token
      }

      $.post("https://hightalkssoapi-test.azurewebsites.net/api/Tenant/ValidateToken", {request: JSON.stringify(validateTokenRequest)}, function(data, status){
        if(data.Status != 1 || !data.IsValid){
          redirectUrl();
        }
      });
    }

    function redirectUrl(){
      // 生成sid标识符，保存在Cookie里
      var random = parseInt(Math.random() * (9999 - 1000 + 1) + 9999);
      $.cookie('sid', random);

      var callbackUrl = encodeURIComponent(window.location.href + "&sid=" + random);
      var url = "https://hightalkssoweb-test.azurewebsites.net/zh-cn/login/index?redirecturl=" + callbackUrl;
      window.location.href = url;
    }
  }
});