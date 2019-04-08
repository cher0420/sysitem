import { getCookies, removeCookies, setCookies } from "../utils/cookie";
import { USERNAME, TOKEN, SID, TENANTID } from "../constants/constants";
import { VOILD_TOKEN_URL, VOILD_USERINFO, LOGIN, LOGOUT } from "../constants/api";
import URL from '../host/baseUrl'
import { request, isIE9 } from "../serive/request";
import yoyStore from '../store/index'; // 命名为yoy空间的store
import { REPLACE } from "../store/mutations";
import { Loading, Message } from 'element-ui';
import { store } from '../storee/store';
import Router from '../router/index';
import router from "../router";
import App from '../App';

export function redirect(type) {
    let random = Math.floor(Math.random() * 1000000)
    const host = window.location.host
    setCookies('SID', random, { expires: 1 }).then(
        () => {
            const http = host === 'localhost:3000' ? 'http' : 'https'
            const callbackString = `${http}://${host}/?sid=${random}&type=login`
            window.location.href = URL.SSOWebUrl.zh + type + callbackString
        }
    )
}

/**
 * 用户登录
 */
let loadingInstance = Loading.service({ fullscreen: true });

export function getLoginStatus() {
    Loading.service({ fullscreen: true });
    // 获取cookie里的token
    const token = getCookies(TOKEN)
        // 如果cookie里的SID存在

    if (token) {
        const sid = getCookies(SID)
        let search = window.location.search

        //验证 url 上的 SID 是否存在
        const matchStr = search.match(/sid=(\S*)?&token=/)
        const str = matchStr ? matchStr[1] : null;

        //验证 url 上的 token 是否存在
        const tokenStr = search.match(/token=(\S*)?&rk/)
        const tokenUrl = tokenStr ? tokenStr[1] : null;

        // url上的sid不空且与cookie的sid一致
        if (tokenUrl && str && str === sid) {
            // url上的sid不空且与cookie的sid一致移除cookie的SID
          if (tokenUrl !== token) {
            //验证url上的token是否存在并且与cookie的token一致
            voildToken(tokenUrl)
          } else {
            voildToken(token)
          }
        } else {
            redirect(LOGIN)
        }

    } else {

        // 如果cookie里的SID不存在则跳转到SSO登录
        const sid = getCookies(SID)
        if (sid) {
            voildId(sid)
        } else {
            redirect(LOGIN)
        }
    }
}

export const voildId = (sid) => {

    let search = window.location.search

    //验证 url 上的 SID 是否存在
    const matchStr = search.match(/sid=(\S*)?&token=/)
    const str = matchStr ? matchStr[1] : null;

    //验证 url 上的 token 是否存在
    const tokenStr = search.match(/token=(\S*)?&rk/)
    const tokenUrl = tokenStr ? tokenStr[1] : null;

    // url上的sid不空且与cookie的sid一致
    if (tokenUrl && str && str === sid) {
        // url上的sid不空且与cookie的sid一致移除cookie的SID
        removeCookies(SID).then(
            () => {
                //验证url上的token是否存在并且与cookie的token一致
                voildToken(tokenUrl)
            }
        )
    } else {
        redirect(LOGIN)
    }
}

/**
 * 验证token
 * @param tokens
 */
export function voildToken(tokens) {
    const url = VOILD_TOKEN_URL
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            'Access-Token': tokens
        },
    }
    request(url, options).then((res) => {
        if (res.IsValid) {
            setCookies(TOKEN, tokens, { expires: 1 }).then(
                () => {
                  fetchUserInfo(tokens)
                }
            )
        } else {
            redirect(LOGIN)
        }
    }).catch(
        (err) => {
            removeCookies([TOKEN]).then(
                () => {
                    redirect(LOGIN)
                }
            )
        }
    )
}

/**
 * fetchUserInfo
 * @param token
 * @return String
 */
export async function fetchUserInfo(token = null) {
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Access-Token": token,
        },
        body: null
    }
    request(VOILD_USERINFO, options).then((res) => {
        const name = res.UserInfo.FullName
        const userInfo = res.UserInfo
        const TenantId = res.UserInfo.TenantId
        yoyStore.dispatch(REPLACE, { userName: name, userInfo, }).then(
            () => {
                setCookies(USERNAME, name, { expires: 1 }).then(
                    setCookies(TENANTID, TenantId, { expires: 1 }).then(
                        () => {
                          /*
                         render 函数
                          */
                          new Vue({
                            el: '#app',
                            store,
                            router,
                            components: { App },
                            template: '<App/>'
                          })
                          loadingInstance.close();
                            hiddenTokenInUrl()
                        }
                    )
                )
            }
        )
    }).catch((error) => {
      Message(
        {
          type: 'error',
          message: '获取当前用户信息失败，正在为您跳转至登录页...',
          duration: 2000,
          onClose(){
            logOut()
          }
        }
      )
    });
}

/**
 * 更新url，隐藏地址
 */
export const hiddenTokenInUrl = () => {
    const path = '/#' + Router.history.current.path
    const stateObject = {};
    const title = "index";
    const newUrl = path;
    const status = isIE9()
    if (!status) {
        // window.history.pushState(stateObject, title, newUrl);
    }
}

export const logOut = () => {
    Loading.service({ fullscreen: true });
    const token = getCookies('token')
    const redirectUrl = 'https://' + window.location.host
    const host = window.location.host
    let random = Math.floor(Math.random() * 1000000)

    removeCookies([USERNAME, TOKEN]).then(
        () => {
            setCookies('SID', random, { expires: 1 }).then(
                () => {
                    const http = host === 'localhost:3000' ? 'http' : 'https'
                    const callbackString = `${http}://${host}/?sid=${random}&type=logout`
                    window.location.href = URL.SSOWebUrl.zh + LOGOUT + callbackString
                }
            )
        }
    )
}
