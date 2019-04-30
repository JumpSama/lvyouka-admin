<template>
  <div>
    <Row :gutter="16" type="flex" justify="start">
      <i-col span="4">
        <DatePicker :value="thisMonth" type="daterange" format="yyyy-MM-dd" size="large" @on-change="dateChange" split-panels placeholder="请选择时间范围"></DatePicker>
      </i-col>
      <Button type="primary" size="large" icon="ios-search" @click="getList">统计</Button>
    </Row>
    <br>
    <Table ref="tableInfo" stripe :columns="columns" :data="data"></Table>
  </div>
</template>

<script>
import { stats } from '@/api/stats'
export default {
  data () {
    return {
      thisMonth: this.getThisMonth(),
      params: {
        start_time: this.getThisMonth()[0],
        end_time: this.getThisMonth()[1]
      },
      columns: [
        {
          title: '操作员',
          key: 'user_id',
          render: (h, params) => {
            return h('p', params.row.user_id === 0 ? '线上支付' : params.row.user_name + '(ID:' + params.row.user_id + ')')
          }
        },
        {
          title: '开卡(个)',
          key: 'new_count'
        },
        {
          title: '续费(个)',
          key: 'renew_count'
        }
      ],
      data: []
    }
  },
  methods: {
    dateChange (date) {
      this.params.start_time = date[0]
      this.params.end_time = date[1]
    },
    getList () {
      stats.recordStats(this.params).then(res => {
        const data = res.data.data
        let list = []
        for (let p in data) {
          list.push(data[p])
        }
        this.data = list
      })
    },
    // 获取当月
    getThisMonth () {
      let tempDate = new Date()
      let month = parseInt(tempDate.getMonth() + 1)
      if (month < 10) month = '0' + month
      const startTime = tempDate.getFullYear() + '-' + month + '-01'
      tempDate.setDate(1)
      tempDate.setMonth(tempDate.getMonth() + 1)
      tempDate.setDate(tempDate.getDate() - 1)
      month = parseInt(tempDate.getMonth() + 1)
      if (month < 10) month = '0' + month
      const endTime = tempDate.getFullYear() + '-' + month + '-' + tempDate.getDate()
      return [startTime, endTime]
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
