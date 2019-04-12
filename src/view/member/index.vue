<template>
  <div>
    <Row :gutter="24" type="flex" justify="start">
      <i-col span="3">
        <Input clearable type="text" v-model="paramsExtend.name" size="large" placeholder="姓名"/>
      </i-col>
      <i-col span="3">
        <Input clearable type="text" v-model="paramsExtend.phone" size="large" placeholder="手机号"/>
      </i-col>
      <i-col span="3">
        <Input clearable type="text" v-model="paramsExtend.identity" size="large" placeholder="身份证号"/>
      </i-col>
      <i-col span="3">
        <Input clearable type="text" v-model="paramsExtend.number" size="large" placeholder="卡号"/>
      </i-col>
      <i-col span="3">
        <Select clearable v-model="paramsExtend.status" size="large" placeholder="状态">
          <Option :value="1">已激活</Option>
          <Option :value="0">已过期</Option>
        </Select>
      </i-col>
      <Button type="primary" size="large" icon="ios-search" @click="searchHandle">搜索</Button>
    </Row>
    <br>
    <Table ref="tableInfo" stripe :columns="columns" :data="data"></Table>
    <br>
    <Page :total="page.total" :current.sync="page.current" show-total @on-change="pageChange"/>
  </div>
</template>

<script>
import { member } from '@/api/member'
import { memberFilters } from '@/libs/filters'
import expandRow from './expand.vue'
export default {
  filters: {
    ...memberFilters
  },
  components: {
    expandRow
  },
  data () {
    return {
      params: {
        offset: 0,
        limit: 10
      },
      paramsExtend: {
        status: '',
        name: '',
        phone: '',
        identity: '',
        number: ''
      },
      page: {
        total: 0,
        current: 1
      },
      columns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                id: params.row.id
              }
            })
          }
        },
        {
          title: 'ID',
          key: 'id'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '积分',
          key: 'point'
        },
        {
          title: '手机',
          key: 'phone'
        },
        {
          title: '身份证',
          key: 'identity'
        },
        {
          title: '状态',
          key: 'status',
          render: (h, params) => {
            return h(
              'p',
              {
                style: {
                  color: this.$options.filters.memberStatusFilter(params.row.status).color
                }
              },
              this.$options.filters.memberStatusFilter(params.row.status).text
            )
          }
        },
        {
          title: '卡号',
          key: 'number'
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
      member.list(Object.assign(this.params, this.paramsExtend)).then(res => {
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
