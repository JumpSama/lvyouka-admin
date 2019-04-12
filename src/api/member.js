import axios from '@/libs/api.request'

export const card = {
  list: data => {
    return axios.request({
      url: 'card_list',
      data,
      method: 'post'
    })
  }
}

export const member = {
  list: data => {
    return axios.request({
      url: 'member_list',
      data,
      method: 'post'
    })
  },
  detail: id => {
    return axios.request({
      url: 'member_detail',
      data: {
        id
      },
      method: 'post'
    })
  }
}

export const approve = {
  list: data => {
    return axios.request({
      url: 'approve_list',
      data,
      method: 'post'
    })
  },
  operate: data => {
    return axios.request({
      url: 'approve_operate',
      data,
      method: 'post'
    })
  },
  member: identity => {
    return axios.request({
      url: 'member_detail',
      data: {
        identity
      },
      method: 'post'
    })
  }
}
