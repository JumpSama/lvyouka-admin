import axios from '@/libs/api.request'

export const distribution = {
  list: data => {
    return axios.request({
      url: 'distribution_list',
      data,
      method: 'post'
    })
  },
  amount: () => {
    return axios.request({
      url: 'distribution_amount',
      method: 'post'
    })
  },
  qrcode: () => {
    return axios.request({
      url: 'distribution_qrcode',
      method: 'post'
    })
  }
}

export const withdraw = {
  withdraw: () => {
    return axios.request({
      url: 'withdraw',
      method: 'post'
    })
  },
  my: data => {
    return axios.request({
      url: 'withdraw_my',
      data,
      method: 'post'
    })
  },
  list: data => {
    return axios.request({
      url: 'withdraw_list',
      data,
      method: 'post'
    })
  },
  operate: data => {
    return axios.request({
      url: 'withdraw_operate',
      data,
      method: 'post'
    })
  }
}
