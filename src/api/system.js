import axios from '@/libs/api.request'

export const getHomeCount = () => {
  return axios.request({
    url: 'home_count',
    method: 'post'
  })
}

export const config = {
  list: data => {
    return axios.request({
      url: 'get_config',
      data,
      method: 'post'
    })
  },
  set: data => {
    return axios.request({
      url: 'set_config',
      data,
      method: 'post'
    })
  }
}

export const logList = data => {
  return axios.request({
    url: 'log_list',
    data,
    method: 'post'
  })
}
