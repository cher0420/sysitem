import store from '../store/index'
import {REPLACE} from "../store/mutations";
import Router from '../router/index'
import {STR} from '../constants/constants'


/**
 * 当用户手动编辑url时，匹配菜单选中状态
 */
export function hashChange (){
  // const hash = window.location.hash
  // const arr = hash.split('/')
  // const pathArr = arr.splice(1,arr.length-1)
  // const newArr = []
  // const navIndex = pathArr[0]
  // for(let v of pathArr){
  //   const url = '/'+v
  //   const name = STR[v]
  //   const obj = {
  //     url, name
  //   }
  //   newArr.push(obj)
  // }
  // store.dispatch(REPLACE,{navIndex:navIndex,breadArr:newArr})
}

  // let pathNameFir = null;
  // let pathNameSec = null;
  // if(hash.indexOf("create") > -1){
  //   pathNameFir = hash.match(/#[/](\S*)[/]/)[1]   //正则匹配{ #/.../ }
  //   pathNameSec = 'create'
  // }else if(hash.indexOf("edit") > -1){
  //   pathNameFir = hash.match(/#[/](\S*)[/]/)[1]   //正则匹配{ #/.../ }
  //   pathNameSec = 'edit'
  // }else {
  //   pathNameFir = hash.match(/#[/](\S*)/)[1]      //正则匹配{ #/... }
  //   pathNameSec = null;
  // }
  // const url = pathNameFir
  // const name = STR[pathNameFir]
  // const obj={
  //   url,name
  // }
  // const arr = [obj]
  // store.dispatch(REPLACE, {navIndex: pathNameFir,breadArr: arr})
// }
window.onhashchange = function(){
  hashChange()
}

