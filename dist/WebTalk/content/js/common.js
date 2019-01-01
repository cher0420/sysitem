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
  return STAGING
}

Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

    // 时间统一函数
  function getTimeText(argument) {
      var timeS = argument;
      var todayT = ''; //
      var yestodayT = '';
      var timeCha = getTimeS(timeS);
      timeS = timeS.slice(-8);
      todayT = new Date().getHours() * 60 * 60 * 1000 + new Date().getMinutes() * 60 * 1000 + new Date().getSeconds() * 1000;
      yestodayT = todayT + 24 * 60 * 60 * 1000;
      return argument.slice(0, 11) + " " + timeS;
  }

  // 时间戳获取
  function getTimeS(argument) {
      var timeS = argument;
      timeS = timeS.replace(/[年月]/g, '/').replace(/[日]/, '');
      return new Date().getTime() - new Date(timeS).getTime() - 1000; //有一秒的误差
  }

  function stringFormat() {
      if (arguments.length == 0)
          return null;
      var str = arguments[0];
      for (var i = 1; i < arguments.length; i++) {
          var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
          str = str.replace(re, arguments[i]);
      }
      return str;
  }

  // 获取Cookie值
  function getCookie(name)
  {
      var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

      if(arr=document.cookie.match(reg))

          return unescape(arr[2]);
      else
          return null;
  }
