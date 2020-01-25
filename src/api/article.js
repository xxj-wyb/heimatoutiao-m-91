// 用于文章数据的获取

import request from '@/utils/request'

/**
 * 获取推荐文章的数据
 * axios中 query参数放置在 params上
 * body参数放置在data上
 * with_top:是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
 * **/
export function getArticles (params) {
  return request({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: { with_top: 1, ...params }
  })
}
