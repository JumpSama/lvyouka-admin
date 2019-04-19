import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  const data = {
    account: userName,
    password
  }
  return axios.request({
    url: 'login',
    data,
    method: 'post'
  })
}

export const getUserInfo = () => {
  return axios.request({
    url: 'me',
    method: 'post'
  })
}

export const logout = () => {
  return axios.request({
    url: 'logout',
    method: 'get'
  })
}

export const password = data => {
  return axios.request({
    url: 'password',
    data,
    method: 'post'
  })
}

// 角色相关路由
export const role = {
  list: data => {
    return axios.request({
      url: 'role_list',
      data,
      method: 'post'
    })
  },
  all: () => {
    return axios.request({
      url: 'role_all',
      method: 'post'
    })
  },
  store: data => {
    return axios.request({
      url: 'role_store',
      data,
      method: 'post'
    })
  },
  detail: id => {
    return axios.request({
      url: 'role_detail',
      data: {
        id
      },
      method: 'post'
    })
  },
  del: id => {
    return axios.request({
      url: 'role_del',
      data: {
        id
      },
      method: 'post'
    })
  },
  menu: () => {
    return axios.request({
      url: 'menu_all',
      method: 'post'
    })
  }
}

// 用户相关路由
export const user = {
  list: data => {
    return axios.request({
      url: 'user_list',
      data,
      method: 'post'
    })
  },
  store: data => {
    return axios.request({
      url: 'user_store',
      data,
      method: 'post'
    })
  },
  detail: id => {
    return axios.request({
      url: 'user_detail',
      data: {
        id
      },
      method: 'post'
    })
  },
  del: id => {
    return axios.request({
      url: 'user_del',
      data: {
        id
      },
      method: 'post'
    })
  },
  operate: data => {
    return axios.request({
      url: 'user_operate',
      data,
      method: 'post'
    })
  }
}

// 场所相关路由
export const site = {
  list: data => {
    return axios.request({
      url: 'site_list',
      data,
      method: 'post'
    })
  },
  all: () => {
    return axios.request({
      url: 'site_all',
      method: 'post'
    })
  },
  store: data => {
    return axios.request({
      url: 'site_store',
      data,
      method: 'post'
    })
  },
  detail: id => {
    return axios.request({
      url: 'site_detail',
      data: {
        id
      },
      method: 'post'
    })
  },
  del: id => {
    return axios.request({
      url: 'site_del',
      data: {
        id
      },
      method: 'post'
    })
  }
}
