import axios from '@/libs/api.request'

export const commodity = {
  list: data => {
    return axios.request({
      url: 'commodity_list',
      data,
      method: 'post'
    })
  },
  store: data => {
    return axios.request({
      url: 'commodity_store',
      data,
      method: 'post'
    })
  },
  detail: id => {
    return axios.request({
      url: 'commodity_detail',
      data: {
        id
      },
      method: 'post'
    })
  },
  del: id => {
    return axios.request({
      url: 'commodity_del',
      data: {
        id
      },
      method: 'post'
    })
  },
  operate: data => {
    return axios.request({
      url: 'commodity_operate',
      data,
      method: 'post'
    })
  }
}

export const order = {
  list: data => {
    return axios.request({
      url: 'order_list',
      data,
      method: 'post'
    })
  },
  operate: data => {
    return axios.request({
      url: 'order_operate',
      data,
      method: 'post'
    })
  }
}
