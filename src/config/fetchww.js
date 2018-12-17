/*
*
* Allen.Song
* 2018/12/14
*
* */

import base from "../host/baseUrl";
import {TOKEN} from "../constants/constants";
import {getCookies} from "../utils/cookie";


export default async (url="", data = {}, type = 'GET') => {
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

  if (window.fetch ) {

    let body = data;
    let requestConfig = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        'Access-Token': token
      },
      body,

    }

    if (type == 'POST') {
      Object.defineProperty(requestConfig, 'body', {
        value: JSON.stringify(data)
      })
    }

    try {
      const response = await fetch(url, requestConfig);
      const responseJson = await response.json();
      return responseJson
    } catch (error) {
      throw new Error(error)
    }
  } else {

    /*
    * 原生ajax
    *
    * */

    return new Promise((resolve, reject) => {
      let requestObj;
      if (window.XMLHttpRequest) {
        requestObj = new XMLHttpRequest();
      } else {
        requestObj = new ActiveXObject;
      }

      let sendData = '';
      if (type == 'POST') {
        sendData = JSON.stringify(data);
      }

      requestObj.open(type, url, true);
      requestObj.setRequestHeader("Content-type", "application/json; charset=utf-8");
      requestObj.setRequestHeader("Access-Token", token);

      requestObj.send(sendData);

      requestObj.onreadystatechange = () => {
        if (requestObj.readyState == 4) {
          if (requestObj.status == 200) {
            let obj = requestObj.response
            if (typeof obj !== 'object') {
              obj = JSON.parse(obj);
            }
            resolve(obj)
          } else {
            reject(requestObj)
          }
        }
      }
    });


/*
* jquery ajax
* */
    // $.ajax({
    //   url: url,
    //   type: type,
    //   headers: {
    //     "Content-Type": "application/json;charset=utf-8",
    //     'Access-Token': token
    //   },
    //   async: false,
    //   dataType: 'json',
    //   data: JSON.stringify(data),
    // })
    //   .done(function (res) {
    //     thisDate = res;    //需要返回thisDate
    //   })
    //   .fail(function (err) {
    //     console.log(err);
    //   })
    //   .always(function () {
    //
    //   });
   //  return thisDate;





  }
};



