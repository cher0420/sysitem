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

// var apiHost = "https://hightalkadminapi-test.azurewebsites.net/api";
var apiHost = "https://hightalkadminapi-staging.azurewebsites.net/api";
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

    var urlParamId = $.getUrlParam('id');
    init();
    function init() {
        if (urlParamId != "" && urlParamId != null && urlParamId != undefined) {
            GetCategoryList();
            botObject = {};
            $.post(apiHost + "/WebTalk/GetWebTalkInfo", { id: urlParamId }, function (result) {
                botObject = result.model;
                renderPage();
                if (botObject.BotConfigId == null) {
                    $(".panel-alert, #recon").show();
                    return;
                }

                verifyAuthorization(host, returnCitySN.cip, function () {
                    if (isAuthorize) {
                        addMsg('Hightalk', botObject.DialogGreetings);

                        if (botObject.NavigationSwitch == "1") {
                            getNavigation("homepage", "首页");
                        }
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

    // 验证是否被授权
    function verifyAuthorization(host, cip, callback) {
        $.post(apiHost + "/WebTalk/VerifyAuthorization", { id: botObject.BotConfigId, host: host, cip: cip }, function (result) {
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
        $.post(apiHost + "/WebTalk/GetWebTalkAnswer", { id: botObject.BotConfigId, webtalkid: botObject.WebTalkId, question: question }, function (result) {
            if (result != undefined && result != null) {
                if (result.status == 1) {
                    if (result.answer != "" && result.answer != null && result.answer != undefined) {
                        var answer = "";
                        for (var i = 0; i < result.answer.length; i++) {
                            answer += filterMsgSpechars(result.answer[i]);
                            if (i < result.answer.length - 2) {
                                answer += "\n";
                            } else if (i < result.answer.length - 1) {
                                answer += "\n\n";
                            }
                        }

                        if (result.categoryid != "" && result.categoryid != null) {
                            if (categoryNewList.hasOwnProperty(result.categoryid)) {
                                isRelevance = true;
                                var category = categoryList[result.categoryid];
                                if (navigationList.hasOwnProperty(category.ID)) {
                                    drawCrumbsBar(category.ID, category.CategoryName);
                                } else {
                                    getNavigation(category.ID, category.CategoryName);
                                }
                            }
                        }

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
            var rbg = (botObject.BotHeadPortrait == "" || botObject.BotHeadPortrait == null) ? "./robot.png" : botObject.BotHeadPortrait;
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

    function drawNavigation(id) {
        var html = "";
        if (navigationList.hasOwnProperty(id)) {
            var data = navigationList[id];
            var className = id == "homepage" ? "homepage" : "";
            if (intentKeyList.indexOf(id) != -1) {
                className = className + " intent";
            }

            for (var i = 0; i < data.length; i++) {
                html += "<li class='panel-navigation-item " + className + "' data-id='" + data[i].ID + "'";
                if (intentKeyList.indexOf(id) != -1) {
                    html += " data-intent='" + data[i].Name + "' data-ishasentity='" + data[i].IsHasEntity + "'>" + data[i].FriendlyName + "</li>";
                } else {
                    html += ">" + data[i].Name + "</li>";
                }
            }
        }

        if (html == "") {
            html = "<content class='no-data'>没有找到匹配的记录</content>"
        }

        $("#navigation").html(html);
        $("#navigation").find(".panel-navigation-item").off("click").on("click", function () {
            var navigationId = $(this).data("id");
            var name = $(this).html();
            if ($(this).hasClass("intent")) {
                var isHasEntity = $(this).data("ishasentity");
                var intentName = $(this).data("intent");
                addMsg("guest", sendMsgDispose(name));
                if (isHasEntity == true) {
                    callWebTalkService(name);
                } else {
                    getKnowledgeBase(intentName, name);
                }

                if (FAQList.hasOwnProperty(navigationId)) {
                    drawFAQ(navigationId);
                } else {
                    getFAQList(navigationId);
                }

                return;
            }

            if (navigationList.hasOwnProperty(navigationId)) {
                drawCrumbsBar(navigationId, name);
            } else {
                getNavigation(navigationId, name);
            }
        });
    }

    // 根据Bot答案，导航页自动联动，重新绘制面包屑
    function drawCrubsBarFromIntentName(list, category) {
        var bar = $(".panel-navigation .crumbs-bar");
        var html = "<div class='crumbs-nav-item active' data-id='homepage' >首页</div >"
        for (var i = list.length - 1; i >= 0; i--) {
            html += "<div class='crumbs-nav-icon'>></div>"
                + "<div class='crumbs-nav-item active' data-id='" + list[i].ID + "' >" + list[i].CategoryName + "</div >";
        }

        bar.html(html);
    }
    var isRelevance = false;
    function drawCrumbsBar(id, name) {
        if (isRelevance) {
            drawCrubsBarFromIntentName(categoryNewList[id], categoryList[id]);
            isRelevance = false;
        }

        var bar = $(".panel-navigation .crumbs-bar");
        var item = bar.find(".crumbs-nav-item[data-id='" + id + "']");
        if (item.length > 0) {
            item.nextAll().remove();
            item.addClass("active");
        } else {
            bar.find(".crumbs-nav-item.active").removeClass("active");

            var html = "";
            if (bar.find(".crumbs-nav-item").length > 0) {
                html += "<div class='crumbs-nav-icon'>></div>"
            }

            html += "<div class='crumbs-nav-item active' data-id='" + id + "' >" + name + "</div >"
            bar.append(html);
        }

        var barH = bar.outerHeight();
        $(".panel-navigation .panel-navigation-list").css("height", "calc(100% - " + barH + "px)");
        drawNavigation(id);
        $(".panel-navigation .crumbs-bar .crumbs-nav-item").off("click").on("click", function () {
            if ($(this).hasClass("active")) {
                return;
            }

            var id = $(this).data("id");
            var name = $(this).html();
            if (navigationList.hasOwnProperty(id)) {
                drawCrumbsBar(id, name);
            } else {
                getNavigation(id, name);
            }
        });

        if ($(".panel-FAQ").is(":visible")) {
            $("#FAQ").empty();
            $(".panel-FAQ").hide();
            $(".panel-navigation").removeClass("splitscreen");
        }
    }
    function sendErrorMsg() {
        addMsg("Hightalk", "抱歉，暂时没有相关的答案信息，我们已记录您的问题，感谢您的支持!");
    }
    function drawFAQ(id) {
        var html = "";
        FAQAnswerList = {};
        if (FAQList.hasOwnProperty(id)) {
            var data = FAQList[id];
            for (var i = 0; i < data.length; i++) {
                FAQAnswerList[data[i].ID] = data[i].FAQContent;
                html += "<li class='panel-FAQ-item' data-id='" + data[i].ID + "'>" + data[i].FAQTitle + "</li>";
            }
        }

        if (html == "") {
            $("#FAQ").empty();
            $(".panel-FAQ").hide();
            $(".panel-navigation").removeClass("splitscreen");
            return;
        }

        $("#FAQ").html(html);
        $("#FAQ").find(".panel-FAQ-item").off("click").on("click", function () {
            addMsg("guest", sendMsgDispose($(this).html()));
            addMsg("Hightalk", FAQAnswerList[$(this).data("id")]);
        });

        if (!$(".panel-FAQ").is(":visible")) {
            $(".panel-FAQ").show();
            $(".panel-navigation").addClass("splitscreen");
        }
    }

    function buildNavigationList(data) {
        if (data == null) {
            return;
        }

        var key = "";
        if (data.ParentID == null || data.ParentID == "") {
            key = "homepage";
        } else {
            key = data.ParentID;
        }

        if (data.Categories.length > 0) {
            navigationList[key] = data.Categories;
        }

        if (data.Intents.length > 0) {
            navigationList[key] = data.Intents;
            intentKeyList.push(key);
        }
    }

    function buildFAQList(data) {
        if (data == null || data.length == 0) {
            return;
        }

        FAQList[data[0].ParentID.toLowerCase()] = data;
    }

    var categoryList = {};
    var categoryNewList = {};
    function buildCategoryList(data) {
        if (data == null || data.length == 0) {
            return;
        }

        var hasParentList = [];
        for (var i = 0; i < data.length; i++) {
            var val = data[i];
            if (val.ParentID != "" && val.ParentID != null && hasParentList.indexOf(val.ParentID) == -1) {
                hasParentList.push(val.ParentID);
            }

            categoryList[val.ID] = val;
        }

        for (var j = 0; j < data.length; j++) {
            var val = data[j];
            if (hasParentList.indexOf(val.ID) != -1) {
                continue;
            }

            categoryNewList[val.ID] = [];
            GetCategoryCombination(val.ID, val.ID);
        }
    }

    function GetCategoryCombination(categoryId, parentID) {
        var category = categoryList[parentID];
        if (!categoryNewList.hasOwnProperty(parentID)) {
            categoryNewList[categoryId].push(category);
        }

        if (category.ParentID != "" && category.ParentID != null) {
            GetCategoryCombination(categoryId, category.ParentID);
        }
    }

    function getKnowledgeBase(intentName, name) {
        $.post(apiHost + "/WebTalk/GetKnowledgeBase", { id: botObject.BotConfigId, intentName: intentName }, function (result) {
            if (result != undefined && result != null) {
                if (result.status == 1) {
                    if (result.knowledgeBase != "" && result.knowledgeBase != null && result.knowledgeBase != undefined) {
                        var knowledgeBase = "您好！您的问题是：" + name + "，相关条款如下：\n";
                        knowledgeBase += filterMsgSpechars(result.knowledgeBase);
                        knowledgeBase += "\n\n亲，请问我还有什么可以帮助您的么？"
                        addMsg("Hightalk", sendMsgDispose(knowledgeBase));
                    } else {
                        sendErrorMsg();
                    }
                } else {
                    sendErrorMsg();
                }
            }
        }).error(function () {
            sendErrorMsg();
        });;
    }

    function getNavigation(id, name) {
        var navId = id == "homepage" ? null : id;
        $.post(apiHost + "/WebTalk/GetNavigation", { id: botObject.BotConfigId, navId: navId }, function (result) {
            if (result != undefined && result != null) {
                if (result.status == 1) {
                    buildNavigationList(result.data);
                }

                drawCrumbsBar(id, name);
            }
        });
    }

    function getFAQList(parentID) {
        $.post(apiHost + "/WebTalk/GetFAQList", { id: botObject.BotConfigId, parentID: parentID }, function (result) {
            if (result != undefined && result != null) {
                if (result.status == 1) {
                    buildFAQList(result.data);
                }

                drawFAQ(parentID);
            }
        });
    }

    function GetCategoryList() {
        $.post(apiHost + "/WebTalk/GetCategoryList", { id: urlParamId }, function (result) {
            if (result != undefined && result != null) {
                if (result.status == 1) {
                    buildCategoryList(result.data);
                }
            }
        });
    }
});
