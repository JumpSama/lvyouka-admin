<template>
  <div>
    <Row :gutter="16" type="flex" justify="start">
      <i-col span="4">
        <Select clearable v-model="params.type" size="large" placeholder="统计类型">
          <Option value="site">场所统计</Option>
          <Option value="item">项目统计</Option>
        </Select>
      </i-col>
      <i-col span="4">
        <DatePicker
          :value="thisMonth"
          type="daterange"
          format="yyyy-MM-dd"
          size="large"
          @on-change="dateChange"
          split-panels
          placeholder="请选择时间范围"
        ></DatePicker>
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
        type: 'site',
        start_time: this.getThisMonth()[0],
        end_time: this.getThisMonth()[1]
      },
      columns: [],
      data: []
    }
  },
  methods: {
    dateChange (date) {
      this.params.start_time = date[0]
      this.params.end_time = date[1]
    },
    getList () {
      this.columns = this.getColumns()
      // 请求
      stats.usedStats(this.params).then(res => {
        const data = res.data.data
        let list = []
        for (let p in data) {
          list.push(data[p])
        }
        list.sort((a, b) => b.count - a.count)
        this.data = list
      })
    },
    // 统计字段
    getColumns () {
      if (this.params.type === 'item') {
        return [
          {
            title: '项目',
            key: 'item_name'
          },
          {
            title: '场所',
            key: 'site_name'
          },
          {
            title: '刷卡次数',
            key: 'count'
          }
        ]
      } else {
        return [
          {
            title: '场所',
            key: 'site_name'
          },
          {
            title: '刷卡次数',
            key: 'count'
          }
        ]
      }
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
