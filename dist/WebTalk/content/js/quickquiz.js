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

// var adminApiUrl = "https://hightalkadminapi-test.azurewebsites.net/api";
// var adminApiUrl = "https://hightalkadminapi-staging.azurewebsites.net/api";
var adminApiUrl = "https://hightalkadminapi-uat.azurewebsites.net/api";
var fqavalidaimlApiUrl = "https://hightalkfqavalidaiml-uat.azurewebsites.net";
var navigationList = {};
var intentKeyList = [];
var FAQList = {};
var FAQAnswerList = {};
$(function () {
    var host = ""; //域名
    var cip = ""; //ip
    var isAuthorize = false;
    var botObject = {};
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

    // 获取当前域名
    // if (window.opener != null) {
    //     host = window.opener.location.host;
    // }

    $("#submit").on("click", function () {
        if (!isAuthorize) {
            return;
        }

        var val = $("#text").val();
        if (val == "" || val == null || $.trim(val.replace(/\n/g, "")) == "") {
            return;
        }

        addMsg('guest', sendMsgDispose(val));
        $("#text").val('');
        callWebTalkService(val);
    });

    $("#text").keydown(function (event) {
        if (!isAuthorize) {
            return;
        }

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

                verifyAuthorization(host, returnCitySN.cip, function () {
                    if (isAuthorize) {
                        addMsg('Hightalk', botObject.DialogGreetings);
                    } else {
                        $(".panel-alert, #recon").show();
                    }
                });
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
        webtalk.find(".panel-right").remove();
        webtalk.show();
    }

    // 验证是否被授权
    function verifyAuthorization(host, cip, callback) {
        $.post(adminApiUrl + "/WebTalk/VerifyAuthorization", { id: botObject.BotConfigId, host: host, cip: cip }, function (result) {
            if (result != undefined && result != null) {
                if (result.status == 1) {
                    isAuthorize = result.isAuthorization;
                }

                if (callback != undefined && typeof (callback) == "function") {
                    callback();
                }
            }
        })
    }

    function callWebTalkService(question) {
        $.post(fqavalidaimlApiUrl + "/api/AIML/GetAnswer", { BotRecordId: botObject.BotConfigId, UserId: botObject.WebTalkId, Question: question }, function (result) {
            if (result != undefined && result != null) {
                if (result.Status) {
                    if (result.Data != "" && result.Data != null && result.Data != undefined) {
                        var answer = result.Data.Message;
                        answer = filterMsgSpechars(answer);
                        addMsg("Hightalk", sendMsgDispose(answer));
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

    function sendErrorMsg() {
        addMsg("Hightalk", "抱歉，暂时没有相关的答案信息，我们已记录您的问题，感谢您的支持!");
    }
});
