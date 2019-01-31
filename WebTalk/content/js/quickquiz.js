var adminApiUrl = host()
var navigationList = {};
var intentKeyList = [];
var FAQList = {};
var FAQAnswerList = {};
$(function () {
    var token = getCookie('token');
    if(token == "" || token == null || token == undefined){
      var adminportalUrl = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '')
      location.href = adminportalUrl;
      return;
    }

    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

    $("#submit").on("click", function () {
        var val = $("#text").val();
        if (val == "" || val == null || $.trim(val.replace(/\n/g, "")) == "") {
            return;
        }

        addMsg('guest', sendMsgDispose(val));
        $("#text").val('');
        callWebTalkService(val);
    });

    $("#text").keydown(function (event) {
        var val = $(this).val();
        if (event.keyCode == 13 && event.shiftKey) {
            return;
        }

        if (event.keyCode == 13) {
            event.preventDefault();
            if (val == "" || val == null || $.trim(val.replace(/\n/g, "")) == "") {
                return;
            }

            addMsg('guest', sendMsgDispose(val));
            $(this).val('');
            callWebTalkService(val);
        }
    });

    // 如果返回的答案里包含图片，当点击图片时新打开一个窗口显示。
    $(document).on("click", "#msgs .msg-ball img", function(){
        var src = $(this).attr("src");
        window.open(src);
    });

    var urlParamId = $.getUrlParam('id');
    var botObject = {
        BotConfigId: urlParamId,
        DialogGreetings: "您好，我是小嗨，我已经学会您培训的问答了，快来向我提问吧",
        DialogColor: "#3B65B7",
        DialogTitleColor: "#FFFFFF",
        DialogTitle: "快速问答测试机器人",
        WebTalkId: parseInt(Math.random() * (100000 - 999999 + 1) + 999999)
    };

    init();
    function init() {
        if (urlParamId != "" && urlParamId != null && urlParamId != undefined) {
            renderPage();
            addMsg('Hightalk', botObject.DialogGreetings);
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
        webtalk.find(".panel-right").remove();
        webtalk.show();
    }

    function callWebTalkService(question) {
        var userId = botObject.WebTalkId ? botObject.WebTalkId : parseInt(Math.random() * (100000 - 999999 + 1) + 999999);
      var botRecordId = botObject.BotConfigId ? botObject.BotConfigId : urlParamId;
        $.post(adminApiUrl.fqavalidaimlApi, { BotRecordId: botRecordId, UserId:userId, Question: question }, function (result) {
            if (result != undefined && result != null) {
                if (result.Status) {
                    if (result.Data != "" && result.Data != null && result.Data != undefined) {
                        var answer = result.Data.Message;
                        answer = filterMsgSpechars(answer);
                        var msg = sendMsgDispose(answer);
                        if(msg == null || msg == "" || msg == undefined){
                            msg = "抱歉，当前问题中不包含培训的关键字"
                        }

                        addMsg("Hightalk", msg);
                    } else {
                        sendErrorMsg();
                    }
                } else {
                    sendErrorMsg();
                }
            }
        }).error(function () {
            sendErrorMsg();
        });
    }

    // 发送的信息处理
    function sendMsgDispose(detail) {
        detail = detail.replace(/\r\n/g, "<br />").replace(/\n/g, "<br />").replace(/' '/g, "&nbsp;");
        return detail;
    }

    // 过滤掉前后的符号\n,\r,\f,\t,\v等
    function filterMsgSpechars(value) {
        if (value == null || value == undefined || value == "") {
            return value;
        }

        return value.replace(/^\s+|\s+$/g, '');
    }

    // 如果答案是图片，图片标签
    function drawImageElement(value) {
        return '<img src=' + value + ' />';
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
            var rbg = "./content/image/robot.png";
            str += "<div class=\"msg robot\"><div class=\"msg-left\" worker=\"" + user + "\"><div class=\"msg-host photo\" style=\"background-image: url(" + rbg.replace("normal", "").replace("custom","") + ")\"></div><div class=\"msg-ball\" title=\"" + time + "\">" + content + "</div></div></div>";
        }
        return str;
    }

    function sendErrorMsg() {
        addMsg("Hightalk", "抱歉，暂时没有相关的答案信息，我们已记录您的问题，感谢您的支持!");
    }
});
