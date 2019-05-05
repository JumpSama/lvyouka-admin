<template>
  <div class="list-container">
    <Row :gutter="24" type="flex" justify="start">
      <i-col span="4">
        <Select clearable v-model="paramsExtend.type" size="large" placeholder="类型">
          <Option :value="1">开卡</Option>
          <Option :value="2">续费</Option>
        </Select>
      </i-col>
      <i-col span="4">
        <Input clearable type="text" v-model="paramsExtend.user_keyword" size="large" placeholder="操作员ID、名称"/>
      </i-col>
      <i-col span="4">
        <Input clearable type="text" v-model="paramsExtend.member_keyword" size="large" placeholder="会员名称、身份证、手机号"/>
      </i-col>
      <i-col span="4">
        <DatePicker :value="thisMonth" type="daterange" format="yyyy-MM-dd" size="large" @on-change="dateChange" split-panels placeholder="请选择时间范围"></DatePicker>
      </i-col>
      <Button type="primary" size="large" icon="ios-search" @click="searchHandle">搜索</Button>
      <!-- <Button type="success" style="margin-left:10px;" size="large" icon="md-arrow-round-down" @click="exportHandle">导出</Button> -->
    </Row>
    <br>
    <Table ref="tableInfo" stripe :columns="columns" :data="data"></Table>
    <br>
    <Page :total="page.total" :current.sync="page.current" show-total @on-change="pageChange"/>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import { stats } from '@/api/stats'
import { statsFilters } from '@/libs/filters'
export default {
  filters: {
    ...statsFilters
  },
  data () {
    return {
      spinShow: false,
      thisMonth: this.getThisMonth(),
      params: {
        offset: 0,
        limit: 10
      },
      paramsExtend: {
        type: '',
        pay_type: 2,
        user_keyword: '',
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
          title: '类型',
          key: 'type',
          render: (h, params) => {
            return h(
              'p',
              {
                style: {
                  color: this.$options.filters.recordTypeFilter(params.row.type).color
                }
              },
              this.$options.filters.recordTypeFilter(params.row.type).text
            )
          }
        },
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
          title: '开卡/续费时间',
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
      stats.recordList(Object.assign(this.params, this.paramsExtend)).then(res => {
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
    },
    // 导出
    exportHandle () {
      this.spinShow = true
      stats.recordExport(this.paramsExtend).then(res => {
        const data = res.data
        this.spinShow = false
        if (data.code === 200) {
          this.$Message.success(data.msg)
          window.open(data.data.url)
        } else {
          this.$Message.error(data.msg)
        }
      }).catch(() => {
        this.spinShow = false
        this.$Message.error('导出失败')
      })
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

<style lang="less" scoped>
.list-container {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
}
</style>
