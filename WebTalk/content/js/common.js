function host() {
  var apiUrl = {
    getwebchatinfoApi : "/api/admin/channel/webchat/getwebchatinfo", // 获取客户端网页聊天窗口配置信息
    verifyauthorizationApi : "/api/admin/channel/webchat/verifyauthorization", // 客户端网页聊天窗口授权认证
    getanswerApi : "/api/admin/channel/webchat/getanswer", // 获取bot答案
    getkbApi : "/api/admin/channel/webchat/getkb", // 获取KB库的答案
    getnavigationApi : "/api/admin/channel/webchat/getnavigation", // 获取导航栏信息
    getfaqlistApi : "/api/admin/channel/webchat/getfaqlist", // 获取常见问题
    getcategorylistApi : "/api/admin/channel/webchat/getcategorylist", // 获取全部的分类数据
    getanswerV2Api : "/api/admin/channel/v2/webchat/getanswer", // 获取bot答案
    getkbV2Api : "/api/admin/channel/v2/webchat/getkb", // 获取答案
    fqavalidaimlApi : "/api/aiml/qqa/getanswer", // 快速问答培训测试接口
  }
  return apiUrl
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
