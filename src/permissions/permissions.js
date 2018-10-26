import {getCookies, removeCookies, setCookies} from "../utils/cookie";
import {USERNAME,TOKEN} from "../constants/constants";
import {VOILD_TOKEN_URL, VOILD_USERINFO,LOGIN,LOGOUT} from "../constants/api";
import URL from '../host/baseUrl'
import {request,isIE9} from "../serive/request";
import store from '../store/index'
import {REPLACE} from "../store/mutations";
import {Loading} from 'element-ui';

export function redirect(type){
  const redirectUrl = window.location.href
  window.location.href = URL.SSOWebUrl.zh+ type + redirectUrl
}
/**
 * 用户登录
 */
export function getLoginStatus(){
  let loadingInstance = Loading.service({fullscreen: true});
  const userName = getCookies(USERNAME)
  const token = getCookies(TOKEN)
  if(userName&&token){
    //验证token
    voildToken(token).then(
      () => {
        setTimeout(
          () => {
            loadingInstance.close();
          },800
        )
      }
    )
  }else{
    //检验是否有SID
    voildId().then(
      () => {
        setTimeout(
          () => {
            loadingInstance.close();
          },800
        )
      }
    )
  }
}

export async function voildId (){
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
        redirect(LOGIN)//跳转登录
    }
}

/**
 * 验证token
 * @param token
 */
export async function voildToken (token) {
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
      removeCookies([USERNAME,TOKEN]).then(
        () => {
          redirect(LOGIN)
        }
      )
    });
}

/**
 * fetchUserInfo
 * @param token
 * @return String
 */
export async function fetchUserInfo (token = null) {
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
    const userInfo  = res.UserInfo
    const TenantId  = res.UserInfo.TenantId
    store.dispatch(REPLACE,{userName: name, userInfo,}).then(
      ()=>{
        setCookies('userName',name, {expires: 1}).then(
          setCookies('TenantId',TenantId,{expires: 1}).then(
            () => {
              hiddenTokenInUrl()
            }
          )
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
  // const path = '/#'+Router.history.current.path
  // const stateObject = {};
  // const title = "index";
  // const newUrl = path;
  // const status = isIE9()
  // if(!status){
  //   window.history.pushState(stateObject, title, newUrl);
  // }
}

export const logOut = () => {
  let loadingInstance = Loading.service({fullscreen: true});
  const token = getCookies('token')
  const redirectUrl = 'http://'+window.location.host
  removeCookies([USERNAME,TOKEN]).then(
    () => {
      loadingInstance.close();
      window.location.href = URL.SSOWebUrl.zh+ LOGOUT + redirectUrl + '&token='+token
    }
  )
}


