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
