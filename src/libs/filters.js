export const userFilters = {
  userStatusFilter (status) {
    const statusMap = {
      0: {
        text: '禁用',
        color: '#ff9900'
      },
      1: {
        text: '正常',
        color: '#19be6b'
      }
    }
    return statusMap[status] ? statusMap[status] : {}
  }
}

export const cardFilters = {
  cardStatusFilter (status) {
    const statusMap = {
      0: {
        text: '未激活',
        color: '#ff9900'
      },
      1: {
        text: '已激活',
        color: '#19be6b'
      },
      2: {
        text: '已挂失',
        color: '#a9a9a9'
      }
    }
    return statusMap[status] ? statusMap[status] : {}
  }
}

export const memberFilters = {
  memberStatusFilter (status) {
    const statusMap = {
      0: {
        text: '已过期',
        color: '#ff9900'
      },
      1: {
        text: '已激活',
        color: '#19be6b'
      }
    }
    return statusMap[status] ? statusMap[status] : {}
  },
  approveStatusFilter (status) {
    const statusMap = {
      0: {
        text: '未支付',
        color: '#ff9900'
      },
      1: {
        text: '待审核',
        color: '#19be6b'
      },
      2: {
        text: '已拒绝',
        color: '#a9a9a9'
      }
    }
    return statusMap[status] ? statusMap[status] : {}
  }
}

export const shopFilters = {
  commodityStatusFilter (status) {
    const statusMap = {
      0: {
        text: '下架',
        color: '#ff9900'
      },
      1: {
        text: '上架',
        color: '#19be6b'
      }
    }
    return statusMap[status] ? statusMap[status] : {}
  },
  orderStatusFilter (status) {
    const statusMap = {
      0: {
        text: '待领取',
        color: '#ff9900'
      },
      1: {
        text: '已完成',
        color: '#19be6b'
      }
    }
    return statusMap[status] ? statusMap[status] : {}
  }
}
