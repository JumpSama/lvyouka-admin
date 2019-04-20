import axios from '@/libs/api.request'

export const card = {
  list: data => {
    return axios.request({
      url: 'card_list',
      data,
      method: 'post'
    })
  },
  add: number => {
    return axios.request({
      url: 'card_add',
      data: {
        number
      },
      method: 'post'
    })
  },
  record: data => {
    return axios.request({
      url: 'card_use_log_add',
      data,
      method: 'post'
    })
  },
  detail: data => {
    return axios.request({
      url: 'card_use_log',
      data,
      method: 'post'
    })
  }
}

// 会员列表
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
  },
  storeNew: data => {
    return axios.request({
      url: 'card_to_member',
      data,
      method: 'post'
    })
  },
  storeBind: data => {
    return axios.request({
      url: 'card_bind_member',
      data,
      method: 'post'
    })
  },
  storeChange: data => {
    return axios.request({
      url: 'card_change_member',
      data,
      method: 'post'
    })
  },
  getCode: phone => {
    return axios.request({
      url: 'send_sms',
      data: {
        phone
      },
      method: 'post'
    })
  }
}

// 审核
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
