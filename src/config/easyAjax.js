/*
*
* 简易版封装
* Allen.Song
* 2018/12/14
*
* */

import base from "../host/baseUrl";
import {TOKEN} from "../constants/constants";
import {getCookies} from "../utils/cookie";


const easyAjax = function (url, data = {}, type = 'GET') {
  type = type.toUpperCase();
  const token = getCookies(TOKEN);
  let thisDate;


  if (type == 'GET') {
    let dataStr = ''; //数据拼接字符串
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&';
    })

    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
      url = url + '?' + dataStr;
    }
  }


  url = base.requestHost + url;
  $.ajax({
    url: url,
    type: type,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      'Access-Token': token
    },
    async: false,
    dataType: 'json',
    data: JSON.stringify(data),
  })
    .done(function (res) {
      thisDate = res;    //需要返回thisDate
    })
    .fail(function (err) {

    })
    .always(function () {

    });
  return thisDate;
}


export default easyAjax
