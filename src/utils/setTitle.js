import store from '../store/index'
import {REPLACE} from "../store/mutations";

export function computedUrl (key,obj,callback) {
  for ( let item of obj.values() ){
    switch (item.id) {
      case key:
        if(item.children){
          // noinspection JSAnnotator
          arguments.callee(item.parent,item.children)
        }else{
          callback
        }
        break;

    }
  }
}
