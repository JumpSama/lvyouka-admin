<template>
  <div>
    <Row :gutter="24" type="flex" justify="start">
      <i-col span="4">
        <Input clearable type="text" v-model="paramsExtend.name" size="large" placeholder="用户名称"/>
      </i-col>
      <i-col span="4">
        <Input clearable type="text" v-model="paramsExtend.content" size="large" placeholder="操作内容"/>
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
import { logList } from '@/api/system'
export default {
  data () {
    return {
      params: {
        offset: 0,
        limit: 10
      },
      paramsExtend: {
        name: '',
        content: ''
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
          title: '用户',
          key: 'user_id',
          render: (h, params) => {
            return h(
              'p',
              params.row.user_name + '(ID:' + params.row.user_id + ')'
            )
          }
        },
        {
          title: 'IP',
          key: 'ip'
        },
        {
          title: '操作内容',
          key: 'content'
        },
        {
          title: '操作时间',
          key: 'created_at'
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
      logList(Object.assign(this.params, this.paramsExtend)).then(res => {
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
