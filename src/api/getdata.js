import fetch from '@/config/fetch'


/**
 * api请求量
 */

export const addCategory = data => fetch('/api', data, 'POST'); // url parameter  methor
