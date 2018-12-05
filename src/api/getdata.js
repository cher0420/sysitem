import fetch from '@/config/fetch'


/**
 * api请求量
 */

export const getCategory = restaurant_id => fetch('/shopping/getcategory/' + restaurant_id); // url parameter  methor
