<template>
  <div class="spin-container">
    <Row :gutter="16" type="flex" justify="start">
      <i-col span="4">
        <Select v-model="paramsExtend.status" size="large" clearable>
          <Option :value="0">待审核</Option>
          <Option :value="1">已提现</Option>
          <Option :value="2">审核驳回</Option>
        </Select>
      </i-col>
      <i-col span="4">
        <DatePicker type="daterange" format="yyyy-MM-dd" size="large" @on-change="dateChange" split-panels placeholder="请选择时间范围"></DatePicker>
      </i-col>
      <Button type="primary" size="large" icon="ios-search" @click="searchHandle">搜索</Button>
      <Poptip confirm title="确认提现?" @on-ok="withdraw" transfer v-if="amount > 0" >
        <Button style="margin-left: 20px;" type="success" size="large" icon="logo-usd">提现（当前余额：{{amount}}）</Button>
      </Poptip>
      <Button v-else style="margin-left: 20px;" disabled size="large" icon="logo-usd">提现（当前余额：{{amount}}）</Button>
    </Row>
    <br>
    <Table ref="tableApprove" stripe :columns="columns" :data="data">
      <!-- 操作 -->
      <template slot="action" slot-scope="props">
        <Poptip
          confirm
          title="确认重新申请?"
          @on-ok="operateHandle({id: props.id, type: 're_approve'})"
          transfer
          style="margin-right: 5px;"
          v-if="props.status == 2"
        >
          <Button type="success" size="small">申请</Button>
        </Poptip>
      </template>
    </Table>
    <br>
    <Page :total="page.total" :current.sync="page.current" show-total @on-change="pageChange"/>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import { distribution, withdraw } from '@/api/distribution'
import { withdrawFilters } from '@/libs/filters'
export default {
  filters: {
    ...withdrawFilters
  },
  data () {
    return {
      spinShow: false,
      amount: 0,
      params: {
        offset: 0,
        limit: 10
      },
      paramsExtend: {
        status: '',
        start_time: '',
        end_time: ''
      },
      page: {
        total: 0,
        current: 1
      },
      columns: [
        {
          title: 'ID',
          key: 'id'
        },
        {
          title: '状态',
          key: 'status',
          render: (h, params) => {
            return h(
              'p',
              {
                style: {
                  color: this.$options.filters.withdrawStatusFilter(params.row.status).color
                }
              },
              this.$options.filters.withdrawStatusFilter(params.row.status).text
            )
          }
        },
        {
          title: '提现金额',
          key: 'amount'
        },
        {
          title: '提现时间',
          key: 'created_at'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 240,
          render: (h, params) => {
            return ('div', this.$refs.tableApprove.$scopedSlots.action({
              id: params.row.id,
              status: params.row.status
            }))
          }
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
      withdraw.my(Object.assign(this.params, this.paramsExtend)).then(res => {
        let data = res.data.data
        this.data = data.list
        this.page.total = parseInt(data.total)
      })
    },
    getAmount () {
      distribution.amount().then(res => {
        const d = res.data

        if (d && d.code === 200) {
          this.amount = d.data.amount
        }
      })
    },
    withdraw () {
      this.spinShow = true
      withdraw.withdraw().then(res => {
        this.spinShow = false
        const d = res.data
        if (d && d.code === 200) {
          this.$Message.success(d.msg)
          this.searchHandle()
        } else {
          this.$Message.error(d.msg)
        }
      })
    },
    operateHandle (data) {
      this.spinShow = true
      withdraw.operate(data).then(res => {
        this.spinShow = false
        let d = res.data
        if (d && d.code === 200) {
          this.$Message.success(d.msg)
          this.searchHandle()
        } else {
          this.$Message.error(d.msg)
        }
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
    this.getAmount()
    this.getList()
  }
}
</script>

<style lang="less" scoped>
.spin-container {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
}
</style>
