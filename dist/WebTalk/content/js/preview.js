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
var adminApiUrl = host().api
$(function () {
  var botObject = {};
  $.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
  }

  // 如果返回的答案里包含图片，当点击图片时新打开一个窗口显示。
  $(document).on("click", "#msgs .msg-ball img", function(){
    var src = $(this).attr("src");
    window.open(src);

  });

  var urlParamId = $.getUrlParam('id');
  init();
  function init() {
    if (urlParamId != "" && urlParamId != null && urlParamId != undefined) {
      botObject = {};
      $.post(adminApiUrl + "/WebTalk/GetWebTalkInfo", { id: urlParamId }, function (result) {
        botObject = result.model;
        renderPage();
        if (botObject.BotConfigId == null) {
          $(".panel-alert, #recon").show();
          return;
        }

        addMsg('Hightalk', botObject.DialogGreetings);
      }).error(function () {
        $(".webtalk").show();
        $(".panel-alert, #recon").show();
      });
    } else {
      $(".webtalk").show();
      $(".panel-alert, #recon").show();
    }
  }

  function renderPage() {
    var webtalk = $(".webtalk");

    webtalk.find(".panel-head").css("background-color", botObject.DialogColor).css('color',botObject.DialogTitleColor);
    webtalk.find(".panel-head-title").html(botObject.DialogTitle);

    webtalk.find(".panel-head-user").remove();

    webtalk.find(".panel-alert").css("background-color", botObject.DialogColor);

    if (botObject.NavigationSwitch != 1) {
      webtalk.find(".panel-right").remove();
    } else {
      webtalk.find(".panel-right-head").html(botObject.NavigationTitle);
      webtalk.find(".panel-FAQ-title").html(botObject.FAQTitle);
      webtalk.find(".webtalk-panel").removeClass("no-navigation");
      webtalk.find(".panel-right").show();
    }

    webtalk.show();
  }

  // 增加信息
  function addMsg(user, content) {
    var str = creadMsg(user, content);
    var msgs = document.getElementById("msgs");
    $("#msgs").append(str);
    ($('#msgs').children("div:last-child")[0]).scrollIntoView();
  }

  // 生成内容
  var datetime = "";
  function creadMsg(user, content) {
    var str = "";
    var time = new Date().Format("yyyy年MM月dd日 HH:mm:ss");
    var timeText = getTimeText(new Date().Format("yyyy年MM月dd日 HH:mm:ss"));
    if (new Date().getTime() > datetime + 30000) {
      str = "<div class='msg min time' data-time='" + time + "'>" + timeText + "</div>";
    }

    datetime = new Date().getTime();
    if (user == 'guest') {
      str += "<div class=\"msg guest\"><div class=\"msg-right\"><div class=\"msg-host headDefault\"></div><div class=\"msg-ball\" title=\"" + time + "\">" + content + "</div></div></div>"
    }
    else {
      var rbg = (botObject.BotHeadPortrait == "" || botObject.BotHeadPortrait == null) ? "./content/image/robot.png" : botObject.BotHeadPortrait;
      str += "<div class=\"msg robot\"><div class=\"msg-left\" worker=\"" + user + "\"><div class=\"msg-host photo\" style=\"background-image: url(" + rbg.replace("normal", "").replace("custom","") + ")\"></div><div class=\"msg-ball\" title=\"" + time + "\">" + content + "</div></div></div>";
    }
    return str;
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
});
