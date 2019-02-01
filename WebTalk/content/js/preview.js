var adminApiUrl = host()
$(function () {
  var token = getCookie('token');
  if(token == "" || token == null || token == undefined){
    var adminportalUrl = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '')
    location.href = adminportalUrl;
    return;
  }

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
      $.post(adminApiUrl.getwebchatinfoApi, { id: urlParamId }, function (result) {
        botObject = result.model;
        renderPage();
        if (botObject.BotConfigId == null) {
          return;
        }

        addMsg('Hightalk', botObject.DialogGreetings);
      }).error(function () {
        $(".webtalk").show();
      });
    } else {
      $(".webtalk").show();
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
});
