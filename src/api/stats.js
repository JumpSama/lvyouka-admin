import axios from '@/libs/api.request'

export const stats = {
  recordList: data => {
    return axios.request({
      url: 'record_list',
      data,
      method: 'post'
    })
  },
  recordExport: data => {
    return axios.request({
      url: 'record_export',
      data,
      method: 'post'
    })
  },
  recordStats: data => {
    return axios.request({
      url: 'record_stats',
      data,
      method: 'post'
    })
  },
  usedList: data => {
    return axios.request({
      url: 'used_list',
      data,
      method: 'post'
    })
  },
  usedStats: data => {
    return axios.request({
      url: 'used_stats',
      data,
      method: 'post'
    })
  }
}
