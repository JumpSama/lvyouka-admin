<template>
  <div>
    <Row :gutter="24" type="flex" justify="start">
      <i-col span="4">
        <Select v-model="paramsExtend.status" size="large" clearable>
          <Option :value="0">未激活</Option>
          <Option :value="1">已激活</Option>
          <Option :value="2">已挂失</Option>
        </Select>
      </i-col>
      <i-col span="4">
        <Input clearable type="text" v-model="paramsExtend.number" size="large" placeholder="卡号"/>
      </i-col>
      <i-col span="4">
        <Input
          clearable
          type="text"
          v-model="paramsExtend.member_id"
          size="large"
          placeholder="用户ID"
        />
      </i-col>
      <i-col span="4">
        <Input
          clearable
          type="text"
          v-model="paramsExtend.member_name"
          size="large"
          placeholder="用户名称"
        />
      </i-col>
      <Button type="primary" size="large" icon="ios-search" @click="searchHandle">搜索</Button>
    </Row>
    <br>
    <Table ref="tableUser" stripe :columns="columns" :data="data"></Table>
    <br>
    <Page :total="page.total" :current.sync="page.current" show-total @on-change="pageChange"/>
  </div>
</template>

<script>
import { cardFilters } from '@/libs/filters'
import { card } from '@/api/member'
export default {
  filters: {
    ...cardFilters
  },
  data () {
    return {
      params: {
        offset: 0,
        limit: 10
      },
      paramsExtend: {
        status: '',
        number: '',
        member_id: '',
        member_name: ''
      },
      page: {
        total: 0,
        current: 1
      },
      columns: [
        {
          title: '卡号',
          key: 'number'
        },
        {
          title: '卡片状态',
          key: 'status',
          render: (h, params) => {
            return h(
              'p',
              {
                style: {
                  color: this.$options.filters.cardStatusFilter(params.row.status).color
                }
              },
              this.$options.filters.cardStatusFilter(params.row.status).text
            )
          }
        },
        {
          title: '关联用户',
          key: 'user_id',
          render: (h, params) => {
            return h(
              'p',
              params.row.status === 1 ? params.row.member_name + '(ID:' + params.row.member_id + ')' : '未关联'
            )
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
      card.list(Object.assign(this.params, this.paramsExtend)).then(res => {
        let data = res.data.data
        this.data = data.list
        this.page.total = parseInt(data.total)
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
