<template>
  <div>
    <Row :gutter="16" type="flex" justify="start">
      <i-col span="4">
        <Input clearable type="text" v-model="paramsExtend.member_keyword" size="large" placeholder="会员名称、身份证、手机号"/>
      </i-col>
      <i-col span="4">
        <Input clearable type="text" v-model="paramsExtend.site_name" size="large" placeholder="场所名称"/>
      </i-col>
      <i-col span="4">
        <Input clearable type="text" v-model="paramsExtend.item_name" size="large" placeholder="项目名称"/>
      </i-col>
      <i-col span="4">
        <DatePicker :value="thisMonth" type="daterange" format="yyyy-MM-dd" size="large" @on-change="dateChange" split-panels placeholder="请选择时间范围"></DatePicker>
      </i-col>
      <Button type="primary" size="large" icon="ios-search" @click="searchHandle">搜索</Button>
    </Row>
    <br>
    <Table stripe :columns="columns" :data="data"></Table>
    <br>
    <Page :total="page.total" :current.sync="page.current" show-total @on-change="pageChange"/>
  </div>
</template>

<script>
import { stats } from '@/api/stats'
export default {
  data () {
    return {
      thisMonth: this.getThisMonth(),
      params: {
        offset: 0,
        limit: 10
      },
      paramsExtend: {
        item_name: '',
        site_name: '',
        member_keyword: '',
        start_time: this.getThisMonth()[0],
        end_time: this.getThisMonth()[1]
      },
      page: {
        total: 0,
        current: 1
      },
      columns: [
        {
          title: '会员姓名',
          key: 'name'
        },
        {
          title: '会员手机',
          key: 'phone'
        },
        {
          title: '会员身份证',
          key: 'identity'
        },
        {
          title: '场所',
          key: 'site_name'
        },
        {
          title: '项目',
          key: 'item_name'
        },
        {
          title: '刷卡时间',
          key: 'created_at'
        }
      ],
      data: []
    }
  },
  methods: {
    dateChange (date) {
      this.paramsExtend.start_time = date[0]
      this.paramsExtend.end_time = date[1]
    },
    searchHandle () {
      this.page.current = 1
      this.params.offset > 0 ? (this.params.offset = 0) : this.getList()
    },
    pageChange (page) {
      this.params.offset = (page - 1) * this.params.limit
    },
    getList () {
      stats.usedList(Object.assign(this.params, this.paramsExtend)).then(res => {
        let data = res.data.data
        this.data = data.list
        this.page.total = parseInt(data.total)
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
  watch: {
    params: {
      handler: 'getList',
      deep: true
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
