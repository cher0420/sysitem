import store from '../store/index'
import {REPLACE} from "../store/mutations";

export function computedUrl (key,obj) {
  console.log(key,obj)
  for ( let item of obj.values() ){
    switch (item.id) {
      case key:
        debugger;
        if(item.children){
          computedUrl(item.parent,item.children)
        }else{
          const navIndex = item.chineseName
          store.dispatch(REPLACE,{navIndex})
        }
        break;

    }
  }
}
