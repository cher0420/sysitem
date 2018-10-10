import store from '../store/index'
import {REPLACE} from "../store/mutations";

/**
 * 当用户手动编辑url时，匹配菜单选中状态
 */
window.onhashchange = function(){
  const hash = window.location.hash
  let pathNameFir = null;
  let pathNameSec = null;
  if(hash.indexOf("create") > -1){
    pathNameFir = hash.match(/#[/](\S*)[/]/)[1]   //正则匹配{ #/.../ }
    pathNameSec = 'create'
  }else if(hash.indexOf("edit") > -1){
    pathNameFir = hash.match(/#[/](\S*)[/]/)[1]   //正则匹配{ #/.../ }
    pathNameSec = 'edit'
  }else {
    pathNameFir = hash.match(/#[/](\S*)/)[1]      //正则匹配{ #/... }
    pathNameSec = null;
  }
  console.log(pathNameFir);
  store.commit(REPLACE, {navIndex: pathNameFir})
}

