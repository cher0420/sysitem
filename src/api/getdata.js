import fetch from '../config/easyAjax';

/**
 *  api异步请求
 */


/**
 *  21.分词
 */
export const participle  = params => fetch('/api/QuickQA/GetKeyWords' , params,"post");  //  将一句话分成多个词汇







