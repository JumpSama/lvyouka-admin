<template>
  <div>
    <Row :gutter="24" type="flex" justify="start">
      <i-col span="4">
        <Input clearable type="text" v-model="paramsExtend.order_id" size="large" placeholder="订单号"/>
      </i-col>
      <i-col span="4">
        <Input clearable type="text" v-model="paramsExtend.name" size="large" placeholder="商品名称"/>
      </i-col>
      <i-col span="4">
        <Input clearable type="text" v-model="paramsExtend.keyword" size="large" placeholder="用户名称、手机"/>
      </i-col>
      <i-col span="4">
        <Select clearable v-model="paramsExtend.status" size="large" placeholder="订单状态">
          <Option :value="1">待领取</Option>
          <Option :value="2">已完成</Option>
        </Select>
      </i-col>
      <Button type="primary" size="large" icon="ios-search" @click="searchHandle">搜索</Button>
    </Row>
    <br>
    <Table ref="tableUser" stripe :columns="columns" :data="data">
      <!-- 操作 -->
      <template slot="action" slot-scope="props">
        <Poptip
          confirm
          title="是否确认订单完成?"
          @on-ok="operateHandle({id: props.id, type: 'done'})"
          transfer
          v-if="props.status == 1"
        >
          <Button type="success" size="small">订单完成</Button>
        </Poptip>
      </template>
    </Table>
    <br>
    <Page :total="page.total" :current.sync="page.current" show-total @on-change="pageChange"/>
  </div>
</template>

<script>
import { shopFilters } from '@/libs/filters'
import { order } from '@/api/shop'
export default {
  filters: {
    ...shopFilters
  },
  data () {
    return {
      params: {
        offset: 0,
        limit: 10
      },
      paramsExtend: {
        name: '',
        status: '',
        keyword: '',
        order_id: ''
      },
      page: {
        total: 0,
        current: 1
      },
      columns: [
        {
          title: '订单号',
          key: 'order_id'
        },
        {
          title: '商品名称',
          key: 'commodity_name'
        },
        {
          title: '购买用户',
          key: 'member_name',
          render: (h, params) => {
            return h('p', params.row.member_name + '(ID:' + params.row.member_id + ')')
          }
        },
        {
          title: '用户手机',
          key: 'phone'
        },
        {
          title: '花费积分',
          key: 'amount'
        },
        {
          title: '状态',
          key: 'status',
          render: (h, params) => {
            return h(
              'p',
              {
                style: {
                  color: this.$options.filters.orderStatusFilter(params.row.status).color
                }
              },
              this.$options.filters.orderStatusFilter(params.row.status).text
            )
          }
        },
        {
          title: '下单时间',
          key: 'created_at'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return ('div', this.$refs.tableUser.$scopedSlots.action({
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
    searchHandle () {
      this.page.current = 1
      this.params.offset > 0 ? (this.params.offset = 0) : this.getList()
    },
    pageChange (page) {
      this.params.offset = (page - 1) * this.params.limit
    },
    getList () {
      order.list(Object.assign(this.params, this.paramsExtend)).then(res => {
        let data = res.data.data
        this.data = data.list
        this.page.total = parseInt(data.total)
      })
    },
    operateHandle (data) {
      order.operate(data).then(res => {
        let data = res.data
        if (data.code === 200) {
          this.$Message.success(data.msg)
          this.getList()
        } else {
          this.$Message.error(data.msg)
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
    this.getList()
  }
}
</script>
