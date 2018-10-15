import {getCookies, removeCookies, setCookies} from "../utils/cookie";
import {USERNAME,TOKEN,VOILD_TOKEN_URL, VOILD_USERINFO} from "../constants/constants";
import URL from '../host/baseUrl'
import {request} from "../serive/request";
import Router from '../router/index'
import store from '../store/index'
import {REPLACE} from "../store/mutations";

export function redirect(){
  const redirectUrl = window.location.href
  window.location.href = URL.SSOWebUrl.zh + redirectUrl
}
/**
 * 用户登录
 */
export function getLoginStatus(){
  const userName = getCookies(USERNAME)
  const token = getCookies(TOKEN)
  if(userName&&token){
    //验证token
    voildToken(token)
  }else{
    //检验是否有SID
    voildId()
  }
}

export const voildId = () => {
  const path = window.location.search
    const matchToken = path.match(/token=(\S*)?&rk=/)
    const token = matchToken?matchToken[1]:null;
    if(token){
        removeCookies([TOKEN,USERNAME]).then(
        ()=>{
          voildToken(token)
        }
      ).catch(
        err => err
      )
    }else{
        redirect()//跳转登录
    }
}

/**
 * 验证token
 * @param token
 */
export const voildToken = (token) => {
  const url = URL.SSOServerApi+ VOILD_TOKEN_URL
  const data = {
    Token: token,
  };
  const baseData = JSON.stringify(data)
  const options = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: baseData
  }
  request(url, options).then((res) => {
    if (res.Status) {
      //存储token
      //修改地址隐藏token
      setCookies('token',token,{ expires: 1 }).then(
        () => {
          fetchUserInfo(token)
          //获取个人信息
        }
      )
    } else {
      console.log('*****',res)
    }
  }).catch(
    (err)=>
    {
      console.log('++++',err)
    });
}

/**
 * fetchUserInfo
 * @param token
 * @return String
 */
export const fetchUserInfo = (token = null) => {
  const options = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Access-Token": token,
    },
    body: null
  }
  request(URL.SSOServerApi + VOILD_USERINFO,options).then((res) => {
    const name = res.UserInfo.FullName
    store.dispatch(REPLACE,{userName: name}).then(
      ()=>{
        setCookies('userName',name, {expires: 1}).then(
          () => {
            hiddenTokenInUrl()
          }
        )
      }
    )
  }).catch((error) => {
    console.log('请求失败', error)
  });
}

/**
 * 更新url，隐藏地址
 */
export const hiddenTokenInUrl = () => {
  const path = '/#'+Router.history.current.path
  const stateObject = {};
  const title = "index";
  const newUrl = path;
  window.history.pushState(stateObject, title, newUrl);
}


