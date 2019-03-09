import {isIE9} from "../serive/request";

export function unhtml (str) {
  return str ? str.replace(/[<">']/g, (a) => {
    return {
      '<': '&lt;',
      '"': '&quot;',
      '>': '&gt;',
      "'": '&#39;'
    }[a]
  }) : ''
}
export function htmlDecodeByRegExp (str) {
  let s = ''
  if (str.length === 0) return ''
  s = str.replace(/&amp;/g, '&')
  s = s.replace(/&lt;/g, '<')
  s = s.replace(/&gt;/g, '>')
  s = s.replace(/&nbsp;/g, ' ')
  s = s.replace(/&#39;/g, "\'")
  s = s.replace(/&quot;/g, '"')
  return s
}

/**
 * 数组去重
 * @param array
 * @return {Array}
 */
function uniq(array){
  const temp = []; //一个新的临时数组
  for(let i = 0; i < array.length; i++){
    if(temp.indexOf(array[i]) == -1){
      temp.push(array[i]);
    }
  }
  return temp;
}


export function BoswersClosed ( ) {

  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
  var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
  var isIE11 = userAgent.indexOf("rv:11.0") > -1; //判断是否是IE11浏览器
  var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器


  if(!isIE && !isEdge && !isIE11) {//兼容chrome和firefox
    var _beforeUnload_time = 0, _gap_time = 0;
    var is_fireFox = navigator.userAgent.indexOf("Firefox")>-1;//是否是火狐浏览器
    window.onunload = function (){
      _gap_time = new Date().getTime() - _beforeUnload_time;
      if(_gap_time <= 5){
        $.post('webLoginController.do?delSession2');//浏览器关闭
      }else{//浏览器刷新
      }
    }
    window.onbeforeunload = function (){
      _beforeUnload_time = new Date().getTime();
      if(is_fireFox){//火狐关闭执行
        $.post('webLoginController.do?delSession2');//浏览器关闭
      }
    };
  }

  if(isIE) {//兼容ie8,9,10
    window.onbeforeunload = function() {
      //alert(0);
      flagiii = "1";
      $.ajax({
        type: "post",
        url: "webLoginController.do?A",
        data:{"flagiii": flagiii},
        success: function() {

        },
        async:false
      });

    }
    window.onunload = onclose;
    function onclose(){
      flagiii = "0";
      $.ajax({
        type: "post",
        url: "webLoginController.do?storageData",
        data:{"flagiii": flagiii},
        success: function() {

        }
      });
    }
  }
}

